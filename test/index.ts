import {ConfigurationEntity, Field, BaseHttpService, Group, EntityUtils, EntityType, Signal} from 'audako-core';

const signal = new Signal();

const signalProperties = EntityUtils.getEntityPropertiesByType(EntityType.Signal, true);

console.log(signal.RecordingSettings);

EntityUtils.setPropertyValue(signal, 'RecordingSettings.Interval.Value', 400);
console.log(signal.RecordingSettings);





