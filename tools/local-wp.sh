#!/usr/bin/env bash
#
# Build a throwaway WordPress for previewing the theme.
#
# Uses SQLite and PHP's built-in server, so there is no Docker or MySQL to install.
# The install lives outside the repo (~/.ghoroa-wp) and the theme and plugin are
# symlinked in, so edits in the repo are live on refresh.
#
#   ./tools/local-wp.sh          set up (or reset) and start on :8088
#   ./tools/local-wp.sh reset    delete the install and rebuild from scratch
#
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WP_DIR="${GHOROA_WP_DIR:-$HOME/.ghoroa-wp}"
PORT="${GHOROA_WP_PORT:-8088}"
URL="http://localhost:${PORT}"

command -v php >/dev/null || { echo "php not found. brew install php"; exit 1; }

# Capture first: piping into `grep -q` under `set -o pipefail` makes php exit on
# SIGPIPE and the check fails even when the extension is present.
php_modules="$(php -m)"
grep -q pdo_sqlite <<<"$php_modules" || { echo "php is missing pdo_sqlite"; exit 1; }

if [[ "${1:-}" == "reset" ]]; then
  echo "Removing ${WP_DIR}"
  rm -rf "$WP_DIR"
fi

# WP-CLI 2.12 emits PHP 8.5 deprecation notices on stdout, which corrupts every
# `wp option get` reading. Silence them at the interpreter rather than parsing them out.
wp() {
  php -d error_reporting=0 -d display_errors=0 \
    "$WP_DIR/wp-cli.phar" "$@" --path="$WP_DIR" 2>/dev/null
}

if [[ ! -f "$WP_DIR/wp-settings.php" ]]; then
  echo "==> Downloading WordPress and WP-CLI into ${WP_DIR}"
  mkdir -p "$WP_DIR"
  curl -sL https://wordpress.org/latest.tar.gz | tar xz --strip-components=1 -C "$WP_DIR"
  curl -sL https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    -o "$WP_DIR/wp-cli.phar"

  echo "==> Installing the SQLite drop-in"
  curl -sL https://downloads.wordpress.org/plugin/sqlite-database-integration.zip \
    -o "$WP_DIR/sqlite.zip"
  unzip -q -o "$WP_DIR/sqlite.zip" -d "$WP_DIR/wp-content/plugins/"
  cp "$WP_DIR/wp-content/plugins/sqlite-database-integration/db.copy" \
     "$WP_DIR/wp-content/db.php"
  # The drop-in ships with placeholders that must point at the real plugin folder.
  perl -pi -e "s|\{SQLITE_IMPLEMENTATION_FOLDER_PATH\}|$WP_DIR/wp-content/plugins/sqlite-database-integration|g; \
               s|\{SQLITE_PLUGIN\}|sqlite-database-integration/load.php|g" \
    "$WP_DIR/wp-content/db.php"

  cat > "$WP_DIR/router.php" <<'ROUTER'
<?php
// Serve real files directly; hand everything else to WordPress so pretty permalinks work.
$path = parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH );
$file = __DIR__ . $path;
if ( '/' !== $path && file_exists( $file ) && ! is_dir( $file ) ) {
	return false;
}
require __DIR__ . '/index.php';
ROUTER

  echo "==> Installing WordPress"
  wp config create --dbname=ghoroa --dbuser=root --dbpass= --skip-check --force --quiet
  wp core install --url="$URL" --title="Ghoroa" \
    --admin_user=admin --admin_password=admin --admin_email=dev@ghoroa.test \
    --skip-email --quiet

  # core install has mangled the URL before; set it explicitly and verify.
  wp option update siteurl "$URL" --quiet
  wp option update home "$URL" --quiet
  [[ "$(wp option get siteurl)" == "$URL" ]] || { echo "siteurl did not stick"; exit 1; }

  echo "==> Linking the theme and plugin"
  ln -sfn "$REPO/ghoroa-theme" "$WP_DIR/wp-content/themes/ghoroa-theme"
  ln -sfn "$REPO/ghoroa-core"  "$WP_DIR/wp-content/plugins/ghoroa-core"
  wp plugin activate ghoroa-core --quiet
  wp theme activate ghoroa-theme --quiet
  wp rewrite structure '/%postname%/' --quiet

  echo "==> Creating the eight IA pages"
  wp post delete 1 2 3 --force --quiet || true
  new_page() { wp post create --post_type=page --post_status=publish \
    --post_title="$1" --post_name="$2" ${3:+--page_template="$3"} --porcelain | tail -1; }

  home_id=$(new_page "Home" "home")
  new_page "Menu"           "menu"           "page-menu"      >/dev/null
  new_page "About"          "about"          ""               >/dev/null
  new_page "Locations"      "locations"      "page-locations" >/dev/null
  new_page "Contact"        "contact"        "page-contact"   >/dev/null
  new_page "FAQ"            "faq"            "page-faq"       >/dev/null
  new_page "Privacy Policy" "privacy-policy" "page-legal"     >/dev/null
  new_page "Terms"          "terms"          "page-legal"     >/dev/null

  wp option update show_on_front page --quiet
  wp option update page_on_front "$home_id" --quiet

  echo "==> Seeding the menu"
  wp eval-file "$WP_DIR/wp-content/plugins/ghoroa-core/tools/seed-menu.php" \
    "$REPO/docs/Ghoroa_Menu_Transcribed.md" | tail -1
fi

echo
echo "Ghoroa running at ${URL}   (admin / admin at ${URL}/wp-admin)"
echo "Ctrl-C to stop."
echo
cd "$WP_DIR" && exec php -S "localhost:${PORT}" router.php
