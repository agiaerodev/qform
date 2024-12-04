import crud from 'modules/qcrud/_services/baseService.js'
import {
    FormRequestResponse,
    UpdateResponse,
    RequestParams,
    Field,
    Block,
    DataUpdateBlock,
    DataUpdateField
} from 'modules/qform/contracts/';
import { dataForm, dataBlock, dataField } from 'modules/qform/models';

const API_FORMS = 'apiRoutes.qform.forms'
const API_BLOCKS = 'apiRoutes.qform.blocks'
const API_CREATE_FIELDS = 'apiRoutes.qform.fields'
const API_FIELDS = 'apiRoutes.qform.formFields'
const PARAMS_INCLUDE = 'blocks.fields';

export const getForm = async (id, refresh = false): Promise<FormRequestResponse> => {
    const requestParams: RequestParams = {
        refresh: refresh,
        params: {
            include: PARAMS_INCLUDE,
        },
    };

    try {
        return await crud.show(API_FORMS, id, requestParams)
    } catch (err) {
        console.log(err);
        return { data: dataForm }
    }
}

export const createBlock = async (formId, sortOrder): Promise<Block> => {
    try {
        return await crud.create(API_BLOCKS, { formId, sortOrder })
    } catch (err) {
        console.log(err);
        return dataBlock
    }
}

export const createField = async (data): Promise<Field> => {
    try {
        return await crud.create(API_CREATE_FIELDS, data)
    } catch(err) {
        console.log(err);
        return dataField
    }
}

export const updateBlock = async ({ data }: { data: DataUpdateBlock }): Promise<UpdateResponse> => {
    const ROUTE_REFERENCE = 'apiRoutes.qform.formBlocks'

    try {
        return await crud.put(ROUTE_REFERENCE, data)
    } catch (err) {
        console.log(err);
        return { data: '' }
    }
}

export const updateField = async ({ data }: { data: DataUpdateField }): Promise<UpdateResponse> => {
    try {
        return await crud.post(API_FIELDS, data)
    } catch(err) {
        console.log(err);
        return { data: '' }
    }
}
