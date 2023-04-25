import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { setupModel } from './setupModel.js';

async function loadModel(path) {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/js/');
  dracoLoader.setDecoderConfig({ type: "js" })
  dracoLoader.preload();
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  const modelData = await loader.loadAsync(path);
  console.log(modelData);

  const model = setupModel(modelData);

  return {
    model
  };
}

export { loadModel };