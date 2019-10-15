module BABYLON {
    export interface IInteractions {
        run(): void;
    }

    export class ToBeExtended {
        constructor(param: string) {
            console.log('wahou de lheritage');
        }
    }

    export class Interactions extends ToBeExtended implements IInteractions {
        public engine: Engine;
        public scene: Scene;
        public camera: FreeCamera;
        public cube: Mesh;
        public cubes: AbstractMesh[]=[];
        public cylinder: Mesh;
        public cylinders: AbstractMesh[]=[];
        public sphere: Mesh;
        public spheres: AbstractMesh[]=[];
        public ground: Mesh;
        public skybox: Mesh;

        /**
         * Constructor.
         * @param _canvas the canvas where to draw the scene
         */
        public constructor(private _canvas: HTMLCanvasElement) {
            super('yo');
            this._init();
            this._initLights();
            this._initGeometries();
            this._initPhysics();
            this._initInteractions();

            this.assign(this.cube, {
                maki: 1
            });
        }

        public assign<T extends any, U extends any>(target: T, source: U): T & U {
            for (const key in source) {
                target[key] = source[key];
            }

            return target as T & U;
        }

        /**
         * Runs the interactions game.
         */
        public run(): void {
            var counter = 0;
            this.engine.runRenderLoop(() => {
                this.scene.render();
            counter ++;    
            });
        }

        /**
         * Inits the interactions.
         */
        private _init(): void {
            this.engine = new Engine(this._canvas);
            this.scene = new Scene(this.engine);

            this.camera = new FreeCamera('freeCamera', new Vector3(100, 10, 200), this.scene);
            this.camera.attachControl(this._canvas);
        }

        private _initLights(): void {
            //const light = new PointLight('pointLight', new Vector3(30, 30, 30), this.scene);
            //const light = new DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), this.scene);
            const light = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(0, 1, 0), this.scene);
        }
        private _getMultipleInstance(meshElement:Mesh,nbrInstance: int, layer?:int): AbstractMesh[] {
            var meshElements = [];
            console.log(nbrInstance); 
            for (var index = 0; index < nbrInstance; index++) {
                var x = 0;
                var y = 0;
                var z = 0;
                if(meshElement == this.cylinder){
                    const instance = this.cylinder.createInstance("i" + index);
                    x = 12*index;
                    y = 10*layer;
                    z = 0;
                    instance.position = new BABYLON.Vector3(x, y, z);
                    instance.scaling = new BABYLON.Vector3(1, 1, 1);
                    meshElements.push(instance);
                }
                if(meshElement == this.sphere){
                    const instance = this.sphere.createInstance("i" + index);
                    x = 50*index;
                    y = 5;
                    z = 80;
                    instance.position = new BABYLON.Vector3(x, y, z);
                    instance.scaling = new BABYLON.Vector3(1, 1, 1);
                    meshElements.push(instance);
                }         
            }
            return meshElements;     
        }
        private _initGeometries(): void {

            var countCylindre = 10;
            var countSphere = 4;
            var nbrLayer = 10;

            this.ground = Mesh.CreateGround('ground', 512, 512, 1, this.scene);
            this.ground.isPickable = true;
            var std = new StandardMaterial('std', this.scene);
               std.diffuseTexture = new Texture('../assets/textureBois.jpg', this.scene);
               this.ground.material = std;

            this.cube = Mesh.CreateBox("cube", 5,this.scene);
            var std = new StandardMaterial('std', this.scene);
               std.diffuseTexture = new Texture('../assets/maki.jpg', this.scene);
               this.cube.material = std;
            
            this.cylinder = Mesh.CreateCylinder("cylinder",10,10,10,10,this.scene);
            this.cylinder.isVisible =false;
            var std = new StandardMaterial('',this.scene);
                std.diffuseTexture = new Texture('../assets/images.jpg',this.scene);
                this.cylinder.material = std;
             this.cylinder.isPickable = true;    
            this.sphere = Mesh.CreateSphere("sphere",32,10,this.scene);
            var std = new StandardMaterial('std', this.scene);
               std.diffuseTexture = new Texture('../assets/boule.jpg', this.scene);
               this.sphere.material = std;
           
            for( var i = 0; i<nbrLayer; i++){
                this.cylinders = this._getMultipleInstance(this.cylinder,countCylindre,i);
            }
            this.spheres = this._getMultipleInstance(this.sphere,countSphere);
             	     
            this.camera.setTarget(BABYLON.Vector3.Zero());

            const skybox = Mesh.CreateBox('skybox', 500, this.scene);
            const skyboxMaterial = new StandardMaterial('skybox', this.scene);
            skyboxMaterial.disableLighting = true;
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new CubeTexture('../assets/TropicalSunnyDay', this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
            skybox.material = skyboxMaterial;
            skybox.infiniteDistance = true;
            
        }

        private _initPhysics(): void {
            this.scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin());

            this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, {
                mass: 0
            });
            for(var index = 0; index < this.cylinders.length;index++){
                this.cylinders[index].physicsImpostor = new PhysicsImpostor(this.cylinders[index], PhysicsImpostor.CylinderImpostor, {
                    mass: 1
                });
            }
            for(var index = 0; index<this.spheres.length;index++){
                this.spheres[index].physicsImpostor = new PhysicsImpostor(this.spheres[index], PhysicsImpostor.SphereImpostor, {
                    mass: 1
                });
            }
        }

        private _initInteractions(): void {
            this.scene.onPointerObservable.add((data) => {
                if (data.type !== PointerEventTypes.POINTERUP)
                    for(var index = 0; index<this.cylinders.length;index++){
                        if (data.pickInfo.pickedMesh === this.cylinders[index]) {
                            this.cylinders[index].applyImpulse(data.pickInfo.ray.direction.multiplyByFloats(100, 100, 100), data.pickInfo.pickedPoint);
                        }
                    }
                    for(var index = 0; index<this.spheres.length;index++){
                        if (data.pickInfo.pickedMesh === this.spheres[index]) {
                            this.spheres[index].applyImpulse(data.pickInfo.ray.direction.multiplyByFloats(100, 100, 100), data.pickInfo.pickedPoint);
                        }
                    }
            });
        }
    }
}
