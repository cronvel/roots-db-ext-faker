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
	this.isInit = false ;
}

module.exports = Faker ;



Faker.prototype.generate = function( schema ) {
	if ( ! this.isInit ) { this.init() ; }

	var generator = this.generators[ schema.fake ] ;

	return generator ? generator() : '' ;
} ;



Faker.prototype.init = function() {
	if ( this.isInit ) { return ; }
	this.isInit = true ;

	// Lazy loading, because the lib is huge and takes almost 1 second to startup
	const faker = require( '@faker-js/faker' ).faker ;

	for ( let category in faker ) {
		for ( let key in faker[ category ] ) {
			this.generators[ category + '.' + key ] =
			this.generators[ key ] =
				() => faker[ category ][ key ]() ;
		}
	}
} ;

