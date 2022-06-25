import { ConfigurationEntity, Field } from 'audako-core';

const entity: ConfigurationEntity = new ConfigurationEntity();
entity.Name = new Field<string>('test');

console.log(entity);