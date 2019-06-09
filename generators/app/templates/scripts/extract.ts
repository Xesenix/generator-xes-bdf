import { JsExtractors } from 'gettext-extractor';
import { i18n } from 'xes-webpack-core';

// TODO: move to xes-webpack-core
i18n.extract({
	getJsParser: (xi18n) =>
		xi18n.createJsParser([
			JsExtractors.callExpression('__', {
				arguments: {
					text: 0,
					context: 2,
				},
			}),
			JsExtractors.callExpression('_$', {
				arguments: {
					text: 1,
					textPlural: 2,
					context: 4,
				},
			}),
		]),
});
