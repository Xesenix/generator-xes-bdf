import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'reflect-metadata';

import ReportContainerComponent from 'lib/di/component/report-container';

import AppModule from './app/app.module';

const root: HTMLElement = document.getElementById('app') || document.body;
const app = new AppModule(root, document, window);

app.run().then(() => {
	ReactDOM.render(
		React.createElement(ReportContainerComponent, { app }),
		document.getElementById('app'),
	);
});
