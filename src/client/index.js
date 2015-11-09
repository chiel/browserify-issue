'use strict';

import React from 'react';
import loadJS from 'fg-loadjs';

console.log('client routes!');

loadJS('js/login.js', function() {
	console.log('login loaded');
	require('modules/login');
});
