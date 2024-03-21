import { doGlobalOptions } from "@/api/system";
export const globalParams = {
  sys_title: "",
  sys_url: "",
  sys_logo: "",
  sys_company_logo: "",
  sys_company_name: "",
  sys_contacts: "",
  sys_mobile: "",
  sys_copy_right: "",
  sys_diagram: "",
  sys_service: "",
  sys_version: "",
};

const install = function (Vue, options) {
  Vue.prototype.$globalParam = globalParams;
  doGlobalOptions().then((res) => {
    if (res.success === true) {
      Vue.prototype.$globalParam = res.data;
    } else {
      Vue.prototype.$globalParam = globalParams;
    }
  });
};
export default { globalParams, install };