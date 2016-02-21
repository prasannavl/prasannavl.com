import vfs from "vinyl-fs";
import map from "map-stream";
import fs from "fs";

function displaceSourceMaps(src, dest) {
        
    console.log("Moving source maps out of build..");
    
    let log = (file, cb) => {
        console.log(`${file.history[0]} => ${file.history[1]}`);
        cb(null, file);
    };
    
    let del = (file, cb) => {
        let p = file.history[0];
        fs.unlink(p, () => cb(null, file));
    };

    vfs.src(['./js/**/*.map', './css/**/*.map'], { cwd: src, base: src })
        .pipe(vfs.dest(dest))
        .pipe(map(log))
        .pipe(map(del));
}

displaceSourceMaps("../build", "../artifacts");