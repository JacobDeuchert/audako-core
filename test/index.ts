import {ConfigurationEntity, Field, BaseHttpService, Group, EntityUtils, EntityType, Signal} from 'audako-core';

const group = new Group();

EntityUtils.setPropertyValue(group, 'AdditionalFields.Order', 8, false, false);

console.log(JSON.stringify(group.AdditionalFields));

// EntityUtils.setPropertyValue(signal, 'Name', 'abc');






