const moduleName = 'iform';
const moduleVersion = 'v4';
const urlBase = `/${moduleName}/${moduleVersion}`

export default {
	urlBase : urlBase,
	version: moduleVersion,
  forms : `${urlBase}/forms`,
  fields : `${urlBase}/fields`,
  leads : `${urlBase}/leads`,
  types : `${urlBase}/types`,
  formFields : `${urlBase}/fields/updateOrders`,
  blocks : `${urlBase}/blocks`,
  formBlocks : `${urlBase}/forms/blocks`,
}
