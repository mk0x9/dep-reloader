'use strict';

const chokidar = require('chokidar');
const kexec = require('kexec');
const childProcess = require('child_process');

chokidar.watch('yarn.lock').on('change', () => {
    console.log('yarn.lock has been updated!');
    console.log('reinstalling dependencies');
    console.log();

    const proc = childProcess.spawn('yarn', ['--verbose', '--non-interactive']);

    proc.stdout.on('data', data => {
        process.stdout.write(data);
    });

    proc.stderr.on('data', data => {
        process.stderr.write(data);
    });

    proc.on('close', code => {
        console.log(`yarn process exited with code ${code}`);

        kexec('yarn', ['start']);
    });
});
