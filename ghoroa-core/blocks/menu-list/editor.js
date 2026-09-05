/**
 * Editor UI for the Ghoroa menu list block.
 *
 * Written against the wp.* globals on purpose: no bundler, no node_modules, and
 * nothing to rebuild when the site is handed over.
 */
( function ( blocks, element, components, blockEditor, serverSideRender, i18n ) {
	'use strict';

	var el = element.createElement;
	var __ = i18n.__;

	var CATEGORIES = [
		{ label: __( 'Featured dishes', 'ghoroa-core' ), value: '' },
		{ label: __( 'Breakfast', 'ghoroa-core' ), value: 'breakfast' },
		{ label: __( 'Lunch', 'ghoroa-core' ), value: 'lunch' },
		{ label: __( 'Dinner', 'ghoroa-core' ), value: 'dinner' },
		{ label: __( 'Juice bar', 'ghoroa-core' ), value: 'juice' },
		{ label: __( 'Snacks', 'ghoroa-core' ), value: 'snacks' },
	];

	blocks.registerBlockType( 'ghoroa/menu-list', {
		edit: function ( props ) {
			var attributes = props.attributes;
			var set = props.setAttributes;

			var controls = el(
				blockEditor.InspectorControls,
				null,
				el(
					components.PanelBody,
					{ title: __( 'Menu list', 'ghoroa-core' ) },
					el( components.SelectControl, {
						label: __( 'Meal period', 'ghoroa-core' ),
						value: attributes.category,
						options: CATEGORIES,
						onChange: function ( value ) {
							set( { category: value } );
						},
						__nextHasNoMarginBottom: true,
					} ),
					el( components.ToggleControl, {
						label: __( 'Featured dishes only', 'ghoroa-core' ),
						checked: attributes.featuredOnly,
						onChange: function ( value ) {
							set( { featuredOnly: value } );
						},
						__nextHasNoMarginBottom: true,
					} ),
					el( components.ToggleControl, {
						label: __( 'Show section heading', 'ghoroa-core' ),
						checked: attributes.showHeading,
						onChange: function ( value ) {
							set( { showHeading: value } );
						},
						__nextHasNoMarginBottom: true,
					} ),
					el( components.RangeControl, {
						label: __( 'Maximum items', 'ghoroa-core' ),
						value: attributes.limit,
						min: 1,
						max: 200,
						onChange: function ( value ) {
							set( { limit: value } );
						},
						__nextHasNoMarginBottom: true,
					} )
				)
			);

			return el(
				element.Fragment,
				null,
				controls,
				el(
					'div',
					blockEditor.useBlockProps(),
					el( serverSideRender, {
						block: 'ghoroa/menu-list',
						attributes: attributes,
					} )
				)
			);
		},

		// Server-rendered: nothing is stored in post content.
		save: function () {
			return null;
		},
	} );
} )(
	window.wp.blocks,
	window.wp.element,
	window.wp.components,
	window.wp.blockEditor,
	window.wp.serverSideRender,
	window.wp.i18n
);
