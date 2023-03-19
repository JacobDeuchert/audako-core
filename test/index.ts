import {ConfigurationEntity, Field, BaseHttpService, Group, EntityUtils, EntityType, Signal} from 'audako-core';

const signal = new Signal();

const signalProperties = EntityUtils.getEntityPropertiesByType(EntityType.Signal, true);

console.log(JSON.stringify(signalProperties));

// EntityUtils.setPropertyValue(signal, 'Name', 'abc');






