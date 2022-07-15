import {ConfigurationEntity, Field, BaseHttpService} from 'audako-core';

const entity: ConfigurationEntity = new ConfigurationEntity();
entity.Name = new Field<string>('test');

BaseHttpService.requestHttpConfig('https://water.audako.net').then(config => {
  console.log(config);
});

