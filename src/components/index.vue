<template>
  <div>
    <depth />
  </div>
</template>

<script>
import depth from './depth'
import service from '../js/service.js'
export default {
  data() {
    return {}
  },
  components: {
    depth
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 请求数据
    fetchData() {
      let data = {}
      const success = data => {
        //
      }
      service.getDepth(data, success)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>


