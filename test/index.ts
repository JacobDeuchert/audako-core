import {ConfigurationEntity, Field, BaseHttpService, Group, EntityUtils, EntityType, Signal} from 'audako-core';

const signal = new Signal();

const signalProperties = EntityUtils.getEntityPropertiesByType(EntityType.Signal, true);

console.log(signal.Name);

EntityUtils.setPropertyValue(signal, 'Name', 'abc');
console.log(signal.Name);





