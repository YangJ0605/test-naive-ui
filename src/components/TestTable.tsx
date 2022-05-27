import { defineComponent, onMounted, reactive, ref } from 'vue'
import { NDataTable } from 'naive-ui'

const columns = [
  {
    title: 'Name',
    key: 'name',
    defaultSortOrder: 'ascend',
    sorter: 'default'
  },
  {
    title: 'Age',
    key: 'age',
    sorter: (row1, row2) => row1.age - row2.age
  },
  {
    title: 'Address',
    key: 'address',
    defaultFilterOptionValues: ['London', 'New York'],
    filterOptions: [
      {
        label: 'London',
        value: 'London'
      },
      {
        label: 'New York',
        value: 'New York'
      }
    ],
    filter(value, row) {
      return ~row.address.indexOf(value)
    }
  }
]

const ajaxData = [
  {
    key: 0,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: 1,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park'
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  },
  {
    key: 3,
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park'
  }
]

export default defineComponent({
  name: 'TestTable',
  setup() {
    const data = ref<any[]>([])
    const total = ref(0)
    const pageInfo = reactive({
      pageSize: 1,
      page: 0
    })

    const sleep = (time: number) =>
      new Promise(resolve => setTimeout(resolve, time))

    const getData = async () => {
      await sleep(1500)
      data.value = ajaxData.slice(pageInfo.page, pageInfo.pageSize)
      total.value = ajaxData.length
    }

    onMounted(() => {
      getData()
    })

    return () => (
      <NDataTable
        data={data.value}
        columns={columns}
        pagination={{
          page: pageInfo.page + 1,
          pageSize: pageInfo.pageSize,
          itemCount: total.value,
          pageCount: Math.ceil(total.value / pageInfo.pageSize),
          pageSizes: [1, 2],
          showSizePicker: true,
          onUpdatePage: page => {
            pageInfo.page = page - 1
            getData()
          },
          onUpdatePageSize: pageSize => {
            pageInfo.pageSize = pageSize
            getData()
          }
        }}
        // remote // 不加这个属性，无法得到正确的分页 pageCount无法正常显示，但是fillter可以正常使用，加上reomte后，filter不可用
      />
    )
  }
})
