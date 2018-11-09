export const LoadLayers = (map, styles) =>{
  for (let source in styles){
    map.addSource(source, styles[source].sourceDef)
    for (let layer in styles[source].layers){
      let thisLayer = styles[source].layers[layer]
      let layerDef = {
        "id": `${source}-${layer}`,
        "type": thisLayer.type,
        "source": source,
        "paint": thisLayer.paint
      }
      !thisLayer.filter ? null : layerDef['filter'] = thisLayer.filter
      !thisLayer.layout ? null : layerDef['layout'] = thisLayer.layout
      !thisLayer.minzoom ? null : layerDef['minzoom'] = thisLayer.minzoom;
      !thisLayer.visibility ? null : layerDef["layout"] = { visibility: thisLayer.visibility }
      styles[source].sourceDef.type != 'vector' ? null : layerDef['source-layer'] = thisLayer.source
      map.addLayer(layerDef, thisLayer.placement)
    }
  }
}