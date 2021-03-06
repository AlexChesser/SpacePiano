var size = 10, res = 32, sizeres = size * res, halfsizeres = sizeres / 2;
var buffer1 = [], buffer2 = [], temp;
var grid = [], plane;
var scene, camera, light, renderer;
var geometry, material;
var mouse, projector, ray, intersects = [];
var stats;
var pSystem, pSystem2;

function onDocumentMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	ray.direction = projector.unprojectVector( mouse.clone(), camera );
	ray.direction.subSelf( camera.position ).normalize();

	intersects = ray.intersectObject( plane );
    var point = intersects[0].point;
	console.log(intersects[0].point);

    pSystem.position.x = point.x;
    pSystem.position.z = point.z;
    pSystem.position.y = 48;
    pSystem2.position.x = point.x;
    pSystem2.position.z = point.z;
    pSystem2.position.y = 48;
}

var BoxField = function () {
    if (Detector.webgl) {

        init();
        animate();

    } else {
        document.body.appendChild(Detector.getWebGLErrorMessage());
    }

    function init() {

        var container = document.createElement('div');
        document.body.appendChild(container);

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        //container.appendChild( stats.domElement );

        for (var i = 0, l = res * res; i < l; i++) {

            buffer1[i] = 0;
            buffer2[i] = 0;

        }

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.x = 150;
        camera.position.y = 150;
        camera.position.z = 100; //100 + sizeres;
        camera.lookAt(new THREE.Vector3(halfsizeres, -50, halfsizeres));
        scene.add(camera);

        scene.add(new THREE.AmbientLight(0x808080));

        light = new THREE.SpotLight(0xFFFFFF, 1.25);
        light.position.set(-500, 900, 600);
        light.target.position.set(halfsizeres, 0, halfsizeres);
        light.castShadow = true;

        scene.add(light);

        var light2 = new THREE.DirectionalLight(0x0000FF, 2.5);
        light2.position.set(250, 250, 100);

        scene.add(light2);

        var light3 = new THREE.DirectionalLight(0xFF0000, 2.5);
        light3.position.set(-250, -250, 100);
        scene.add(light3);

        geometry = new THREE.CubeGeometry(size, size, size);
        geometry.applyMatrix(new THREE.Matrix4().setTranslation(0, size / 2, 0));
        material = new THREE.MeshLambertMaterial({ color: 0xD0D0D0 });

        for (var i = 0, l = res * res; i < l; i++) {

            cube = new THREE.Mesh(geometry, material);
            cube.position.x = size + ((i % res) * 10);
            cube.position.z = size + (Math.floor(i / res) * 10);
            cube.castShadow = true;
            cube.receiveShadow = true;
            scene.add(cube);

            grid.push(cube);

        }

        geometry = new THREE.PlaneGeometry(sizeres, sizeres);

        plane = new THREE.Mesh(geometry, material);
        plane.position.x = halfsizeres;
        plane.position.z = halfsizeres;
        plane.rotation.x = -90 * Math.PI / 180;
        plane.visible = false;
        scene.add(plane);

        renderer = new THREE.WebGLRenderer();

        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;

        renderer.shadowCameraNear = 3;
        renderer.shadowCameraFar = camera.far;
        renderer.shadowCameraFov = 50;

        renderer.shadowMapBias = 0.0039;
        renderer.shadowMapDarkness = 0.5;
        renderer.shadowMapWidth = 512;
        renderer.shadowMapHeight = 512;

        var devicePixelRatio = window.devicePixelRatio || 1;

        renderer.setSize(window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio);
        renderer.domElement.style.width = window.innerWidth + 'px';
        renderer.domElement.style.height = window.innerHeight + 'px';

        container.appendChild(renderer.domElement);

        mouse = new THREE.Vector3(0, 0, 1);
        projector = new THREE.Projector();
        ray = new THREE.Ray(camera.position);

        var particleCount = 900,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
            color: 0x00FFFF,
            size: 8,
            map: THREE.ImageUtils.loadTexture('/images/particle.png'),
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        pMaterial2 = new THREE.ParticleBasicMaterial({
            color: 0xFF00FF,
            size: 8,
            map: THREE.ImageUtils.loadTexture('/images/particle.png'),
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        for (var p = 0; p < particleCount; ++p) {
            var pX = Math.random() * 100 - 50,
            pY = Math.random() * 100 - 50,
            pZ = Math.random() * 100 - 50,
            particle = new THREE.Vertex(
                new THREE.Vector3(pX, pY, pZ)
            );
            particles.vertices.push(particle);
        }

        pSystem = new THREE.ParticleSystem(particles, pMaterial);
        pSystem2 = new THREE.ParticleSystem(particles, pMaterial2);
        scene.add(pSystem);
        scene.add(pSystem2);

        //document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    function render() {

        if (intersects.length) {
            var point = intersects[0].point;
            var x = Math.floor(point.x / size);
            var y = Math.floor(point.z / size);

            buffer1[x + y * res] = 10;
        }

        var bottom = res * res - res;

        // update buffers
        for (var i = 0, l = res * res; i < l; i++) {

            var x1, x2, y1, y2;

            if (i % res == 0) {

                // left edge

                x1 = 0;
                x2 = buffer1[i + 1];

            } else if (i % res == res - 1) {

                // right edge

                x1 = buffer1[i - 1];
                x2 = 0;

            } else {

                x1 = buffer1[i - 1];
                x2 = buffer1[i + 1];

            }

            if (i < res) {

                // top edge

                y1 = 0;
                y2 = buffer1[i + res];

            } else if (i > l - res - 1) {

                // bottom edge

                y1 = buffer1[i - res];
                y2 = 0;

            } else {

                y1 = buffer1[i - res];
                y2 = buffer1[i + res];

            }

            buffer2[i] = (x1 + x2 + y1 + y2) / 1.9 - buffer2[i];
            buffer2[i] -= buffer2[i] / 10;

        }

        temp = buffer1;
        buffer1 = buffer2;
        buffer2 = temp;

        // update grid

        for (var i = 0, l = res * res; i < l; i++) {
            grid[i].scale.y += (Math.max(0.1, 0.1 + buffer2[i]) - grid[i].scale.y) * 0.1;
        }

        if (pSystem && pSystem2) {
            pSystem.rotation.y += 0.02;
            pSystem2.rotation.y -= 0.02;
        }

        renderer.render(scene, camera);

    }
}
		