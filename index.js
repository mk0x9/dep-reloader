'use strict';

const chokidar = require('chokidar');
const kexec = require('kexec');
const childProcess = require('child_process');

const ERR_TIMEOUT = 2000;
const files = ['yarn.lock', 'npm-shrinkwrap.json'];
const filename2pm = {
    'yarn.lock': 'yarn',
    'npm-shrinkwrap.json': 'npm'
};
const pm2installCmd = {
    'yarn': ['yarn'],
    'npm': ['npm', ['install']]
};

function depReloader() {
    const watcher = chokidar.watch(files);

    watcher.on('change', filename => {
        watcher.close();

        const pm = filename2pm[filename];
        const pmInstallCmd = pm2installCmd[pm];

        console.log(`${filename} has been updated! Reinstalling dependencies...`);
        console.log();

        const proc = childProcess.spawn.apply(childProcess, pmInstallCmd);

        proc.stdout.on('data', data => {
            process.stdout.write(data);
        });

        proc.stderr.on('data', data => {
            process.stderr.write(data);
        });

        proc.on('close', code => {
            if (code === 0) {
                kexec(pm, ['start']);
            } else {
                setInterval(
                    () => {
                        console.error(`DEP-RELOADER: ${pm} failed update and exited with code ${code}`);
                    },
                    ERR_TIMEOUT
                );
            }
        });
    });
}

module.exports = depReloader;
