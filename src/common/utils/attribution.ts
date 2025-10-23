import { getDeviceType } from './platform';

class Attribution {
_attribution: {
  experiment: string;
  intent: string;
  platform: string;
  product: string;
  program: string | null;
}
_experiment: string;
_platform: 'desktop' | 'mobile' | 'tablet';
_product: string;

constructor() {
  this._platform = 'mobile';
  this._product = 'homepage';
  this._experiment = '';
  this._attribution = {
    experiment: this._experiment,
    intent: '',
    platform: this._platform,
    product: this._product,
    program: null,
  };
}

getAttribution() {
  return this.attribution;
}

setAttribution(intent: string, {
  program = null,
  ...data
}: {
  program?: string | null;
} = {}) {
  this.attribution = {
    ...this._attribution,
    intent,
    program,
    ...data,
  };
}

setPlatform() {
  this._platform = getDeviceType();
}

setProduct(product: string) {
  this._product = product;
}

get attribution() {
  return this._attribution;
}

set attribution(attributes) {
  this._attribution = {
    ...attributes,
    experiment: this._experiment,
    platform: this._platform,
    product: this._product,
  };
}

get experiment() {
  return this._experiment; 
}

set experiment(experiment: string) {
  this._experiment = experiment;
}

get platform() {
  return this._platform;
}

get product() {
  return this._product;
}
}

const attribution = new Attribution();

export default attribution;
