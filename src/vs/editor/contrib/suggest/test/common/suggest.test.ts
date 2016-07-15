/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as assert from 'assert';
import URI from 'vs/base/common/uri';
import {IDisposable} from 'vs/base/common/lifecycle';
import {SuggestRegistry} from 'vs/editor/common/modes';
import {provideSuggestionItems} from 'vs/editor/contrib/suggest/common/suggest';
import {Position} from 'vs/editor/common/core/position';
import {Model} from 'vs/editor/common/model/model';


suite('Suggest', function () {

	let model: Model;
	let registration: IDisposable;

	setup(function () {

		model = Model.createFromString('FOO\nbar\BAR\nfoo', undefined, undefined, URI.parse('foo:bar/path'));
		registration = SuggestRegistry.register({ pattern: 'bar/path' }, {
			triggerCharacters: [],
			shouldAutotriggerSuggest: true,
			provideCompletionItems() {
				return [{
					currentWord: '',
					incomplete: false,
					suggestions: [{
						label: 'aaa',
						type: 'snippet',
						codeSnippet: 'aaa'
					}, {
							label: 'zzz',
							type: 'snippet',
							codeSnippet: 'zzz'
						}, {
							label: 'fff',
							type: 'property',
							codeSnippet: 'fff'
						}]
				}];
			}
		});
	});

	teardown(() => {
		registration.dispose();
		model.dispose();
	});

	test('sort - snippet inline', function () {
		return provideSuggestionItems(model, new Position(1, 1), { snippetConfig: 'inline' }).then(items => {
			assert.equal(items.length, 3);
			assert.equal(items[0].suggestion.label, 'aaa');
			assert.equal(items[1].suggestion.label, 'fff');
			assert.equal(items[2].suggestion.label, 'zzz');
		});
	});

	test('sort - snippet top', function () {
		return provideSuggestionItems(model, new Position(1, 1), { snippetConfig: 'top' }).then(items => {
			assert.equal(items.length, 3);
			assert.equal(items[0].suggestion.label, 'aaa');
			assert.equal(items[1].suggestion.label, 'zzz');
			assert.equal(items[2].suggestion.label, 'fff');
		});
	});

	test('sort - snippet bottom', function () {
		return provideSuggestionItems(model, new Position(1, 1), { snippetConfig: 'bottom' }).then(items => {
			assert.equal(items.length, 3);
			assert.equal(items[0].suggestion.label, 'fff');
			assert.equal(items[1].suggestion.label, 'aaa');
			assert.equal(items[2].suggestion.label, 'zzz');
		});
	});

	test('sort - snippet none', function () {
		return provideSuggestionItems(model, new Position(1, 1), { snippetConfig: 'none' }).then(items => {
			assert.equal(items.length, 1);
			assert.equal(items[0].suggestion.label, 'fff');
		});
	});

	test('sort - snippet top', function () {
		return provideSuggestionItems(model, new Position(1, 1), { snippetConfig: 'only' }).then(items => {
			assert.equal(items.length, 2);
			assert.equal(items[0].suggestion.label, 'aaa');
			assert.equal(items[1].suggestion.label, 'zzz');
		});
	});

});