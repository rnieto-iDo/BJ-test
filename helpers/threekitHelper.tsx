import {
  ISceneQuery,
  IThreekitPlayer,
  IThreekitScene,
  IThreekitPrivatePlayer
} from '@threekit-tools/treble/dist/types';

enum PRIVATE_APIS {
  PLAYER = 'player'
}

interface IThreekitSceneExtend extends IThreekitScene {
  addNode: (value1: any, value2: any) => string;
  set: (value1: any, value2: any) => ISceneQuery;
}

interface IThreekitPlayerExtend extends IThreekitPlayer {
  scene: IThreekitSceneExtend;
  api: any;
}

declare global {
  interface Window {
    threekitE: {
      player: IThreekitPlayerExtend
    };
  }
}

async function updatePositionModel(
  nodeId: string,
  translation: any,
  rotation: any
) {
  window.threekitE.player.api['scene'].set(
    { id: nodeId, plug: 'Transform', property: 'translation' },
    translation
  );
  window.threekitE.player.api['scene'].set(
    { id: nodeId, plug: 'Transform', property: 'rotation' },
    rotation
  );
}

const addModel = (
  assetId: any,
  nameInput: any,
  translation: any,
  rotation: any,
  scale: any,
  position: any
) => {
  var idParent = filterByName({ name: 'ContainerRaxs' }, 'name');
  var generatedId = window.threekitE.player.api['scene'].addNode(
    {
      name: 'product',
      type: 'Model',
      plugs: {
        Null: [
          {
            type: 'Model',
            asset: {
              assetId: assetId,
            },
          },
        ],
        Transform: [
          {
            type: 'Transform',
            translation: translation,
            rotation: rotation,
            scale: scale,
          },
        ],
      },
    },

    idParent[1]
  );
  return generatedId;
}; // end de addModel

const deleteSceneElements = (nodeId: string) => {
  window.threekitE.player.api['scene'].deleteNode(nodeId);
};

const filterByName = (patternFilter: any, key: any, typeReturn = undefined) => {
  let arrayData = window.threekitE.player.api['player'].sceneGraph.nodes;
  let keys = Object.entries(arrayData);
  let dataFiltered = keys.filter((el: any, i) => {
    let tempEval = patternFilter[key];
    if (tempEval[0] === '*') {
      // match
      let value = el[1][key];
      if (
        '*' +
        value.slice(value.length - (tempEval.length - 1), value.length) ===
        tempEval
      ) {
        return true;
      }
    } else {
      return el[1][key] === patternFilter[key];
    }
  });
  let objEntries: any = [];
  dataFiltered.forEach((val: any, i) => {
    if (typeReturn != undefined && val[1]['type'] == typeReturn) {
      objEntries.push(val[1]['id']);
    } else if (typeReturn == undefined) {
      objEntries.push(val[1]['id']);
    }
  });
  return objEntries;
};

const updateThreekitProps = () => {
  let temp: any = window.threekit.player.enableApi(PRIVATE_APIS.PLAYER);
  temp[PRIVATE_APIS.PLAYER] = temp;
  window['threekitE'] = temp;
};

const addCustomSvgWall = (hashFile: string = '') => {
  let idParentGlobal = Object.keys(
    window.threekitE.player.api['player'].sceneGraph.nodes
  ).filter((key) => {
    return (
      window.threekitE.player.api['player'].sceneGraph.nodes[key].type ===
      'Scene'
    );
  })[1];

  let node1 = filterByName({ name: 'VectorRemove' }, 'name');
  let node2 = filterByName({ name: 'VectorCustomRemove' }, 'name');
  if (node1.length > 0) {
    window.threekitE.player.api['scene'].deleteNode(node1[0]);
    window.threekitE.player.api['scene'].deleteNode(node2[0]);
  }

  let customAdd = {
    type: 'Vector',
    name: 'VectorRemove',
    plugs: {
      Vector: [
        {
          type: 'Vector',
          vectorAsset: {
            hash: hashFile,
            type: 'image/svg+xml',
          },
        },
      ],
      Properties: [
        {
          visible: false,
        },
      ],
    },
  };

  let generatedIdVector = window.threekitE.player.api['scene'].addNode(
    customAdd,
    idParentGlobal
  );
  let generatedId = window.threekitE.player.api['scene'].addNode(
    {
      name: 'VectorCustomRemove',
      type: 'Shape',
      plugs: {
        Shape: [
          {
            type: 'VectorShape',
            vector: generatedIdVector,
            curveSegments: 10,
          },
        ],
      },
    },
    idParentGlobal
  );
  window.threekitE.player.api['scene'].set(
    { id: generatedId, plug: 'Properties', property: 'visible' },
    false
  );
  asigneToNodeIdMesh('Mesh From Shape', generatedId);
}; //addCustomSvgWall

const addCustomSvgFloor = (hashFile: string, fileName: string) => {

  const idParentGlobal = Object.keys(
    window.threekitE.player.api.player.sceneGraph.nodes
  ).filter((key) =>
    window.threekitE.player.api.player.sceneGraph.nodes[key].type ===
    'Scene'
  )[1];

  const node1 = filterByName({ name: 'FVectorRemove' }, 'name');
  const node2 = filterByName({ name: 'FVectorCustomRemove' }, 'name');

  if (node1.length > 0) {
    window.threekitE.player.api.scene.deleteNode(node1[0]);
    window.threekitE.player.api.scene.deleteNode(node2[0]);
  }

  const customAdd = {
    type: 'Vector',
    name: 'FVectorRemove',
    plugs: {
      Vector: [
        {
          type: 'Vector',
          vectorAsset: {
            filename: fileName,
            hash: hashFile,
            type: 'image/svg+xml',
          },
        },
      ],
      Properties: [
        {
          visible: false,
        },
      ],
    },
  };

  const generatedIdVector = window.threekitE.player.api.scene.addNode(
    customAdd,
    idParentGlobal
  );

  const generatedId = window.threekitE.player.api.scene.addNode(
    {
      name: 'FVectorCustomRemove',
      type: 'Shape',
      plugs: {
        Shape: [
          {
            type: 'VectorShape',
            vector: generatedIdVector,
            curveSegments: 10,
          },
        ],
      },
    },
    idParentGlobal
  );

  window.threekitE.player.api.scene.set(
    { id: generatedId, plug: 'Properties', property: 'visible' },
    false
  );
  asigneToNodeIdMesh('Floor Mesh From Shape', generatedId);
}; // addCustomSvgFloor

const asigneToNodeIdMesh = (nameContainer: string, nodeID: string) => {
  const meshID = Object.keys(
    window.threekitE.player.api.player.sceneGraph.nodes
  ).filter((key) =>
    window.threekitE.player.api.player.sceneGraph.nodes[key].name ===
    nameContainer
  )[1];

  // window.threekitE.player.api['camera'].frameBoundingSphere(nodeID,null);
  window.threekitE.player.api.scene.set(
    { id: meshID, plug: 'PolyMesh', property: 'shape' },
    nodeID
  );
}; // asigneToNodeIdMesh

export {
  addModel,
  addCustomSvgWall,
  deleteSceneElements,
  updatePositionModel,
  updateThreekitProps,
  addCustomSvgFloor,
  filterByName
};