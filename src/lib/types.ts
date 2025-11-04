export interface userInfo {
    ip_address?: string; // IP地址（数据库varchar(255)，可选，新增字段）
  /** 用户ID（数据库bigint类型，非空） */
  id: number;
  /** 用户名（数据库varchar(255)，非空） */
  username: string;
  /** 密码（数据库varchar(255)，非空，实际项目建议加密存储） */
  password: string;
  /** 邮箱（数据库varchar(255)，可选） */
  email: string;
  /** 手机号（数据库varchar(255)，可选） */
  phone?: string;
  /** 头像URL（数据库varchar(255)，可选，与avatar字段可能存在冗余，需确认业务逻辑） */
  avatarUrl?: string;
  /** 用户角色（数据库varchar(255)，可选，如：admin/normal/user） */
  role?: string;
  /** 用户积分（数据库int类型，可选） */
  points?: number;
  /** 用户等级（数据库int类型，可选） */
  level?: number;
  /** 创建时间（数据库datetime类型，可选，建议用string或Date类型，此处选string适配接口传输） */
  createTime?: string;
  /** 更新时间（数据库datetime类型，可选，同上） */
  updateTime?: string;
  /** 头像（数据库varchar(255)，可选，需确认与avatarUrl的区别，如：本地路径/URL） */
}


export interface Post {
    ID: number; // 帖子的唯一标识符
    instanceID: number; // 实例ID
    createdAt: string; // 创建时间
    updatedAt: string; // 更新时间
    DeletedAt?: string | null; // 删除时间（如果适用）
    title: string; // 帖子标题
    content: string; // 帖子内容
    author: string; // 帖子作者
}

export interface comment {
    ID?: number; // 评论的唯一标识符
    instanceID?: bigint; // 实例ID
    createdAt?: string; // 创建时间
    updatedAt?: string; // 更新时间
    DeletedAt?: string | null; // 删除时间（如果适用）
    content: string; // 评论内容
    author: string; // 评论作者

    refer_id?: bigint;
    refer_type?: string; // 引用的评论类型（可选）
    source_id: BigInt; // 源ID（例如帖子ID）
    source_type: string; // 源类型（例如 "post"）
}
// export interface PostList {//总文章列表
//     totalItems: number; // 总文章数
//     Items: Post[]; // 具体的文章项数组
// }
export interface like {//点赞
    ID: number; // 文章点赞的唯一标识符
    instanceID: number; // 实例ID
    createdAt: string; // 创建时间
    updatedAt: string; // 更新时间
    DeletedAt?: string | null; // 删除时间（如果适用）
    item_id: bigint; // 被点赞项目的ID
    item_type: string; // 被点赞项目的类型，如 "post" 或 "comment"
}


