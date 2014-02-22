var spacepiano = spacepiano || {};
var test = null;
spacepiano.three = {
    scene: null,
    camera: null,
    renderer: null,
    light: null,
    WIDTH: 640,
    HEIGHT: 480,
    objects: [],
    activeObject: null,
    keys: {},
    init: function () {
        var self = spacepiano.three;
        self.scene = new THREE.Scene();
        self.WIDTH = window.innerWidth;
        self.HEIGHT = window.innerHeight;

        self.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        self.renderer.setSize(self.WIDTH, self.HEIGHT);
        self.renderer.setClearColor(0xFFFFFF, 1);
        document.body.appendChild(self.renderer.domElement);

        self.camera = new THREE.PerspectiveCamera(75, self.WIDTH / self.HEIGHT, 0.1, 10000);
        self.camera.position.y = -130;
        self.camera.position.z = 200;
        self.camera.position.x = 10;
        self.camera.rotation.x = 65 * (Math.PI / 180);

        window.addEventListener('resize', function () {
            self.WIDTH = window.innerWidth;
            self.HEIGHT = window.innerHeight;
            self.renderer.setSize(self.WIDTH, self.HEIGHT);
            self.camera.aspect = self.WIDTH / self.HEIGHT;
            self.camera.updateProjectionMatrix();
        })

        var light = new THREE.PointLight(0xFFFFFF);
        light.position.set(-100, -300, 300);
        self.light = light;
        self.scene.add(light);

        self.prepareAssets();
    },
    prepareAssets: function () {
        var self = spacepiano.three;
        var matBasicEbony = new THREE.MeshPhongMaterial({ color: 0x000000 });
        var matBasicIvory = new THREE.MeshLambertMaterial({ color: 0xEEEEEE });
        var matRed = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
        var matBlue = new THREE.MeshLambertMaterial({ color: 0x0000FF });
        var matGreen = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
        var matCornflowerBlue = new THREE.MeshBasicMaterial({ color: 0x6495ED });

        var geoPlane = new THREE.PlaneGeometry(600, 600);
        var plane = new THREE.Mesh(geoPlane, matCornflowerBlue);
        plane.receiveShadow = true;
        var geoWhiteKey = new THREE.CubeGeometry(20, 40, 15);
        geoWhiteKey.applyMatrix(new THREE.Matrix4().makeTranslation(0, -20, 0));
        var whiteKey = new THREE.Mesh(geoWhiteKey, matBasicIvory);
        var geoBlackKey = new THREE.CubeGeometry(15, 20, 10);
        geoBlackKey.applyMatrix(new THREE.Matrix4().makeTranslation(0, -10, 0));
        var blackKey = new THREE.Mesh(geoBlackKey, matBasicEbony);

        var geoAxisX = new THREE.CubeGeometry(600, 5, 5);
        var geoAxisY = new THREE.CubeGeometry(5, 600, 5);
        var geoAxisZ = new THREE.CubeGeometry(5, 5, 600);

        var axisX = new THREE.Mesh(geoAxisX, matRed);
        var axisY = new THREE.Mesh(geoAxisY, matBlue);
        var axisZ = new THREE.Mesh(geoAxisZ, matGreen);
        self.scene.add(axisX);
        self.scene.add(axisY);
        self.scene.add(axisZ);

        var i = 0;
        var x = -150;
        var y = 0;
        var z = 100;
        for (; i < 14; ++i) {
            var whiteKey = new THREE.Mesh(geoWhiteKey, matBasicIvory);
            whiteKey.position.x = x;
            whiteKey.position.y = y;
            whiteKey.position.z = z;
            whiteKey.castShadow = true;
            x += 25;
            self.keys["white" + i] = whiteKey;
            self.scene.add(whiteKey);
        }
        x = -140;
        z += 10;
        var j = 0;
        for (i = 0; i < 13; ++i) {
            var blackKey = new THREE.Mesh(geoBlackKey, matBasicEbony);
            blackKey.position.x = x;
            blackKey.position.y = y;
            blackKey.position.z = z;
            blackKey.castShadow = true;
            if (i != 2 && i != 6 && i != 9) {
                self.keys["black" + j] = blackKey;
                self.scene.add(blackKey);
                j++;
            }
            x += 25;
        }

        self.scene.add(plane);
    },
    alterKey: function (note, angle) {
        var self = spacepiano.three;
        self.keys[note].rotation.x = angle;
    },
    update: function (elapsed) {
        var self = spacepiano.three;
        self.draw();
    },
    draw: function () {
        var self = spacepiano.three;
        self.renderer.render(self.scene, self.camera);
    }
}
