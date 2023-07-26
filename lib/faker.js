/*
	Roots DB Fake Data Generation

	Copyright (c) 2023 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;



//const Promise = require( 'seventh' ) ;
//const log = require( 'logfella' ).global.use( 'roots-db:faker' ) ;


function Faker( collection ) {
	this.collection = collection ;
	this.generate = this.generate.bind( this ) ;
	this.generators = {} ;
	this.locale = this.collection.fakeDataGeneratorConfig.locale ?? 'en' ;

	this.faker = null ;
	this.isInit = false ;
}

module.exports = Faker ;



Faker.prototype.generate = function( schema ) {
	var extraGeneratorName = EXTRA_GENERATORS[ schema.fake ] ;
	if ( extraGeneratorName ) {
		return this[ extraGeneratorName ]( schema , schema.fakeParams ) ;
	}

	if ( ! this.isInit ) { this.init() ; }

	var generator = this.generators[ schema.fake ] ;
	if ( generator ) {
		return generator( schema.fakeParams ) ;
	}

	return '' ;
} ;



Faker.prototype.init = function() {
	if ( this.isInit ) { return ; }
	this.isInit = true ;

	// Lazy loading, because the lib is huge and takes almost 1 second to startup
	const faker = require( '@faker-js/faker' ) ;

	var localeArray = Array.isArray( this.locale ) ? this.locale.map( l => faker[ l ] ) : [ faker[ this.locale ] ] ;

	this.faker = new faker.Faker( {
		locale: localeArray
	} ) ;

	for ( let category in this.faker ) {
		if ( this.faker[ category ] && typeof this.faker[ category ] === 'object' ) {
			for ( let key in this.faker[ category ] ) {
				if ( typeof this.faker[ category ][ key ] === 'function' ) {
					this.generators[ category + '.' + key ] = this.generators[ key ] = this.faker[ category ][ key ] ;
				}
			}
		}
	}
} ;



const EXTRA_GENERATORS = {
	enum: 'generateEnum'
} ;



Faker.prototype.generateEnum = function( schema , params = null ) {
	if ( Array.isArray( params ) && params.length ) {
		return randomElement( params ) ;
	}

	if ( Array.isArray( schema.in ) && schema.in.length ) {
		return randomElement( schema.in ) ;
	}

	return '' ;
} ;



// Utilities

// Return a random element from an array
function randomElement( array ) {
	return array[ Math.floor( Math.random() * array.length ) ] ;
}

