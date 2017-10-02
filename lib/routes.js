const routes = module.exports

routes.STREAM_LIST = "/stream/%s/%s"
routes.STREAM_PUSH = routes.STREAM_LIST
routes.STREAM_LAST_UPDATE = routes.STREAM_PUSH + "/lastUpdate"
routes.STREAM_PULL = routes.STREAM_PUSH
routes.STREAM_SEARCH = routes.STREAM_PUSH

routes.ACTION_INVOKE = "/action/%s/%s"
routes.ACTION_STATUS = routes.INVOKE

routes.PERMISSION_CHECK = "/auth/check"
routes.DEVICE_SYNC = "/auth/sync"
routes.LOGIN = "/auth/login"
routes.LOGOUT = routes.LOGIN
routes.REFRESH_TOKEN = "/auth/refresh"

routes.USER_CREATE = "/auth/user"
routes.USER_LIST = routes.USER_CREATE
routes.USER_GET = routes.USER_CREATE + "/%s"
routes.USER_IMPERSONATE = routes.USER_GET + "/impersonate"
routes.USER_UPDATE = routes.USER_GET
routes.USER_DELETE = routes.USER_GET
routes.USER_GET_ME = "/auth/me"
routes.USER_UPDATE_ME = routes.USER_GET_ME

routes.TOKEN_CREATE = "/auth/token"
routes.TOKEN_UPDATE = routes.TOKEN_CREATE + "/%s"
routes.TOKEN_DELETE = routes.TOKEN_UPDATE
routes.TOKEN_GET = routes.TOKEN_UPDATE
routes.TOKEN_LIST = routes.TOKEN_CREATE + "?uuid=%s"

routes.ROLE_CREATE = "/auth/role"
routes.ROLE_UPDATE = routes.TOKEN_CREATE + "/%s"
routes.ROLE_DELETE = routes.TOKEN_UPDATE
routes.ROLE_LIST = routes.TOKEN_CREATE

routes.PROFILE_GET_ALL = "/profile/%s"
routes.PROFILE_GET = routes.PROFILE_GET_ALL + "/%s"
routes.PROFILE_SET = routes.PROFILE_GET
routes.PREFERENCES_DELETE = routes.PROFILE_GET

routes.PERMISSION_GET = "/auth/permission/%s/%s"
routes.PERMISSION_BY_USER = routes.PERMISSION_GET + "/%s"
routes.PERMISSION_SET = routes.PERMISSION_GET

routes.INVENTORY_LIST = "/inventory/"
routes.INVENTORY_SEARCH = routes.INVENTORY_LIST + "search"
routes.INVENTORY_CREATE = routes.INVENTORY_LIST
routes.INVENTORY_UPDATE = routes.INVENTORY_LIST + "%s"
routes.INVENTORY_LOAD = routes.INVENTORY_UPDATE
routes.INVENTORY_DELETE = routes.INVENTORY_UPDATE

routes.TREE_LIST = "/tree/"
routes.TREE_CREATE = routes.TREE_LIST
routes.TREE_GET = routes.TREE_LIST + "%s"
routes.TREE_CHILDREN = routes.TREE_GET + "/children"
routes.TREE_ADD = routes.TREE_GET
routes.TREE_REMOVE = routes.TREE_GET
routes.TREE_REMOVE_TREE = routes.TREE_GET + "tree"
