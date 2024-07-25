import Vue, { ref, computed, getCurrentInstance } from 'vue'

export default function useCrudLeads() {
    const crudId = Vue.prototype.$uid()
    const modal = ref({
      show: false,
      lead: false
    })
    const tr = Vue.prototype.$tr
    const trp = Vue.prototype.$trp
    const trd = Vue.prototype.$trd
    const clone = Vue.prototype.$clone
    const proxy = getCurrentInstance().proxy

    const resetModal = () => {
      modal.value = {
        show: false, lead: false
      }
    }

    const crudData = computed(() => {
      return {
        crudId,
        entityName: config("main.qform.entityNames.lead"),
        apiRoute: 'apiRoutes.qform.leads',
        permission: 'iforms.leads',
        extraFormFields: 'iforms.crud-fields.leads',
        create: false,
        read: {
          columns: [
            { name: 'id', label: tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
            {
              name: 'formName', 
              label: tr('iforms.cms.form.form'), 
              field: 'form', 
              align: 'left',
              format: val => val ? val.title : ''
            },
            {
              name: 'assignedTo', label: tr('isite.cms.form.assignedTo'), field: 'assignedTo', align: 'left',
              format: val => val ? val.fullName : '-'
            },
            {
              name: 'values', label: trp('isite.cms.label.data'), field: 'values', align: 'left',
              classes: 'ellipsis', style: 'max-width : 350px',
              format: val => val ? Object.values(val).join(', ') : ''
            },
            {
              name: 'createdAt', label: tr('isite.cms.form.createdAt'), field: 'createdAt',
              format: val => val ? trd(val) : '-',
              align: 'left', sortable: true
            },
            {
              name: 'updatedAt', label: tr('isite.cms.form.updatedAt'), field: 'updatedAt',
              format: val => val ? trd(val) : '-',
              align: 'left', sortable: true
            },
            {name: 'actions', label: tr('isite.cms.form.actions'), align: 'right'},
          ],
          requestParams: {
            include: 'form,assignedTo,files',
            filter: {
              order: {
                field: 'created_at',
                way: 'desc',
              }
            }
          },
          filters: {
            formId: {
              value: null,
              type: 'select',
              props: {
                label: tr('iforms.cms.form.form'),
                clearable: true,
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qform.forms',
                select: {label: 'title', id: 'id'},
              }
            }
          },
          actions: [
            {
              name: 'viewLead',
              icon: 'fas fa-eye',
              color: 'info',
              tooltip: tr('isite.cms.label.view'),
              action: (item) => {
                modal.value.lead = item
                modal.value.show = true
              }
            }
          ]
        },
        update: true,
        delete: true,
        formLeft: {
          id: {value: ''},
          assignedToId: {
            value: null,
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('@imagina/quser/_crud/users'),
              crudProps: {
                label: `${trp('isite.cms.form.assignedTo')}`,
              },
              config: {
                options: {
                  label: 'fullName', value: 'id'
                }
              },
            },
          }
        }
      }
    })

    const crudInfo = computed(() => {
      return proxy.$store.state.qcrudComponent.component[crudId] || {}
    })

    //Fields to show
    const showLeadItems = computed(() => {
      const response = []

      if (modal.value.lead) {
        const leadValues = clone(modal.value.lead.values || [])
        const files = clone(modal.value.lead.files)

        //Merge values
        clone(modal.value.lead.form.fields).forEach(field => {
          //get field type
          const fieldType = field.dynamicField ? (field.dynamicField.type || 'input') : 'input'
          //get field value
          const fieldValue = leadValues[field.name] || '-'
          //Get field file
          const fieldFile = (fieldType != 'media') ? null : files.find(item => {
            const fieldPath = fieldValue ? fieldValue.split('?')[0] : '';

            return item.zone == fieldPath.split('/').pop()
          })

          //Add extra data to field
          response.push({
            ...field,
            label: field.label,
            value: (fieldType != 'media') ? fieldValue : [{
              id: crudId,
              ...fieldFile,
              path: fieldValue,
              url: fieldValue,
              mediumThumb: fieldValue,
              filename: field.label,
            }],
            fieldType: fieldType
          })
        })
      }

      //Response
      return response
    })

    return {
      crudId,
      modal,
      resetModal,
      crudData,
      crudInfo,
      showLeadItems
    }
}