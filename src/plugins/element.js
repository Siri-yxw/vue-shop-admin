import Vue from 'vue'
import {
  Button, Form, Input,
  FormItem, Message, Container,
  Header,
  Aside,
  Main, Menu,
  Submenu,
  MenuItem,
  MenuItemGroup, col, breadcrumb, breadcrumbItem, card, select, option, table, tableColumn, popover, tag, Switch, pagination, tooltip, dialog,
  MessageBox
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(col)
Vue.use(breadcrumb)
Vue.use(breadcrumbItem)
Vue.use(card)
Vue.use(select)
Vue.use(option)
Vue.use(table)
Vue.use(tableColumn)
Vue.use(popover)
Vue.use(tag)
Vue.use(pagination)
Vue.use(Switch)
Vue.use(tooltip)
Vue.use(dialog)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm;