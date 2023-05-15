//© 2023 Cognizant. All rights reserved. Cognizant Confidential and/or Trade Secret.

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default [
    {
        input: 'src/collector/collector-liveux.js',
        output: {
            file: 'src/collector/collector-liveux.bundle.js',
            format: 'iife'
        },
        plugins: [
            resolve({
                jsnext: true,
                main: true,
                browser: true,
            }),
            commonjs(),
        ]
    }
];
