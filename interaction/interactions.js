var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BABYLON;
(function (BABYLON) {
    var ToBeExtended = /** @class */ (function () {
        function ToBeExtended(param) {
            console.log('wahou de lheritage');
        }
        return ToBeExtended;
    }());
    BABYLON.ToBeExtended = ToBeExtended;
    var Interactions = /** @class */ (function (_super) {
        __extends(Interactions, _super);
        /**
         * Constructor.
         * @param _canvas the canvas where to draw the scene
         */
        function Interactions(_canvas) {
            var _this = _super.call(this, 'yo') || this;
            _this._canvas = _canvas;
            _this.cubes = [];
            _this.cylinders = [];
            _this.spheres = [];
            _this._init();
            _this._initLights();
            _this._initGeometries();
            _this._initPhysics();
            _this._initInteractions();
            _this.assign(_this.cube, {
                maki: 1
            });
            return _this;
        }
        Interactions.prototype.assign = function (target, source) {
            for (var key in source) {
                target[key] = source[key];
            }
            return target;
        };
        /**
         * Runs the interactions game.
         */
        Interactions.prototype.run = function () {
            var _this = this;
            var counter = 0;
            this.engine.runRenderLoop(function () {
                _this.scene.render();
                counter++;
            });
        };
        /**
         * Inits the interactions.
         */
        Interactions.prototype._init = function () {
            this.engine = new BABYLON.Engine(this._canvas);
            this.scene = new BABYLON.Scene(this.engine);
            this.camera = new BABYLON.FreeCamera('freeCamera', new BABYLON.Vector3(100, 10, 200), this.scene);
            this.camera.attachControl(this._canvas);
        };
        Interactions.prototype._initLights = function () {
            //const light = new PointLight('pointLight', new Vector3(30, 30, 30), this.scene);
            //const light = new DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), this.scene);
            var light = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(0, 1, 0), this.scene);
        };
        Interactions.prototype._getMultipleInstance = function (meshElement, nbrInstance, layer) {
            var meshElements = [];
            console.log(nbrInstance);
            for (var index = 0; index < nbrInstance; index++) {
                var x = 0;
                var y = 0;
                var z = 0;
                if (meshElement == this.cylinder) {
                    var instance = this.cylinder.createInstance("i" + index);
                    x = 12 * index;
                    y = 10 * layer;
                    z = 0;
                    instance.position = new BABYLON.Vector3(x, y, z);
                    instance.scaling = new BABYLON.Vector3(1, 1, 1);
                    meshElements.push(instance);
                }
                if (meshElement == this.sphere) {
                    var instance = this.sphere.createInstance("i" + index);
                    x = 50 * index;
                    y = 5;
                    z = 80;
                    instance.position = new BABYLON.Vector3(x, y, z);
                    instance.scaling = new BABYLON.Vector3(1, 1, 1);
                    meshElements.push(instance);
                }
            }
            return meshElements;
        };
        Interactions.prototype._initGeometries = function () {
            var countCylindre = 10;
            var countSphere = 4;
            var nbrLayer = 10;
            this.ground = BABYLON.Mesh.CreateGround('ground', 600, 600, 1, this.scene);
            this.ground.isPickable = true;
            var std = new BABYLON.StandardMaterial('std', this.scene);
            std.diffuseTexture = new BABYLON.Texture('../assets/textureBois.jpg', this.scene);
            this.ground.material = std;
            this.cube = BABYLON.Mesh.CreateBox("cube", 5, this.scene);
            var std = new BABYLON.StandardMaterial('std', this.scene);
            std.diffuseTexture = new BABYLON.Texture('../assets/maki.jpg', this.scene);
            this.cube.material = std;
            this.cylinder = BABYLON.Mesh.CreateCylinder("cylinder", 10, 10, 10, 10, this.scene);
            this.cylinder.isVisible = false;
            var std = new BABYLON.StandardMaterial('', this.scene);
            std.diffuseTexture = new BABYLON.Texture('../assets/images.jpg', this.scene);
            this.cylinder.material = std;
            this.cylinder.isPickable = true;
            this.sphere = BABYLON.Mesh.CreateSphere("sphere", 32, 10, this.scene);
            var std = new BABYLON.StandardMaterial('std', this.scene);
            std.diffuseTexture = new BABYLON.Texture('../assets/boule.jpg', this.scene);
            this.sphere.material = std;
            for (var i = 0; i < nbrLayer; i++) {
                this.cylinders = this._getMultipleInstance(this.cylinder, countCylindre, i);
            }
            this.spheres = this._getMultipleInstance(this.sphere, countSphere);
            this.camera.setTarget(BABYLON.Vector3.Zero());
            var skybox = BABYLON.Mesh.CreateBox('skybox', 500, this.scene);
            var skyboxMaterial = new BABYLON.StandardMaterial('skybox', this.scene);
            skyboxMaterial.disableLighting = true;
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('../assets/TropicalSunnyDay', this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            skybox.material = skyboxMaterial;
            skybox.infiniteDistance = true;
        };
        Interactions.prototype._initPhysics = function () {
            this.scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
            this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0
            });
            for (var index = 0; index < this.cylinders.length; index++) {
                this.cylinders[index].physicsImpostor = new BABYLON.PhysicsImpostor(this.cylinders[index], BABYLON.PhysicsImpostor.CylinderImpostor, {
                    mass: 1
                });
            }
            for (var index = 0; index < this.spheres.length; index++) {
                this.spheres[index].physicsImpostor = new BABYLON.PhysicsImpostor(this.spheres[index], BABYLON.PhysicsImpostor.SphereImpostor, {
                    mass: 1
                });
            }
        };
        Interactions.prototype._initInteractions = function () {
            var _this = this;
            this.scene.onPointerObservable.add(function (data) {
                if (data.type !== BABYLON.PointerEventTypes.POINTERUP)
                    for (var index = 0; index < _this.cylinders.length; index++) {
                        if (data.pickInfo.pickedMesh === _this.cylinders[index]) {
                            _this.cylinders[index].applyImpulse(data.pickInfo.ray.direction.multiplyByFloats(100, 100, 100), data.pickInfo.pickedPoint);
                        }
                    }
                for (var index = 0; index < _this.spheres.length; index++) {
                    if (data.pickInfo.pickedMesh === _this.spheres[index]) {
                        _this.spheres[index].applyImpulse(data.pickInfo.ray.direction.multiplyByFloats(100, 100, 100), data.pickInfo.pickedPoint);
                    }
                }
            });
        };
        return Interactions;
    }(ToBeExtended));
    BABYLON.Interactions = Interactions;
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=interactions.js.map