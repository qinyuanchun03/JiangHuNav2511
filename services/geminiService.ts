import { LinkItem } from '../types';

// 虽然文件名没变，但现在它的主要功能是获取远程测试数据
// 映射远程 API 可能返回的不同字段格式
export const fetchRemoteLinks = async (): Promise<Omit<LinkItem, 'id' | 'visits'>[]> => {
  try {
    const response = await fetch('https://test1.250221.xyz/');
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Remote API Data:", data); // Debug log
    
    // 假设数据可能是一个数组，或者在某个属性下
    let items: any[] = [];
    if (Array.isArray(data)) {
        items = data;
    } else if (data.data && Array.isArray(data.data)) {
        items = data.data;
    } else if (data.links && Array.isArray(data.links)) {
        items = data.links;
    }

    // 映射数据到我们的 LinkItem 结构
    return items.map((item: any) => {
       // 优先匹配截图中的字段：site_name, site_url, site_tips, belong
       const title = item.site_name || item.title || item.name || item.siteName || '未命名站点';
       
       let url = item.site_url || item.url || item.link || item.href || item.siteUrl;
       
       // 如果是纯字符串数组的情况
       if (typeof item === 'string') {
           url = item;
       }

       if (!url) url = '#';

       // 尝试从 URL 获取默认标题（如果标题为空）
       let finalTitle = title;
       if ((!finalTitle || finalTitle === '未命名站点') && url !== '#') {
           try {
               finalTitle = new URL(url).hostname;
           } catch (e) {
               // ignore
           }
       }

       // 描述优先使用 opinion (点评) 或 site_tips (提示)
       const description = item.opinion || item.site_tips || item.description || item.desc || '来自远程 API 的推荐链接。';
       
       // 分类优先使用 belong
       const category = item.belong || item.category || 'other';
       
       const icon = item.icon || '🌐';

       return {
         title: finalTitle,
         url: url,
         description: description,
         category: category,
         icon: icon
       };
    });

  } catch (error) {
    console.error("Failed to fetch remote links:", error);
    // 发生错误时返回空数组，不中断应用
    return [];
  }
};