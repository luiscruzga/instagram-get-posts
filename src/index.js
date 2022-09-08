const request = require('request');
const imageToBase64 = require('image-to-base64');

class InstagramGetPosts {
  constructor(headers = {}){
    this.headers = headers;
  }

  /**
   * Get profile information
   * @param {string} profile - Profile ID from instagram
   */
  getProfile(profile) {
    return new Promise((resolve, reject) => {
      const options = {
        url: `https://i.instagram.com/api/v1/users/web_profile_info/?username=${profile}`,
        headers: this.headers
      };
      request(options, (err, res, body) => {
        if (err || res.statusCode !== 200) return reject(err);
        resolve((JSON.parse(body)).data.user);
      });
    });
  }

  /**
   * Get posts from a profile
   * @param {object} options - Options
   * @param {string} options.profile - Profile ID from instagram
   * @param {boolean} options.getBase64 - Get images in base64
   * @param {number} options.maxPosts - Max number of posts to be returned 
   * @param {boolean} options.getRandomItem - Get a random post from the list
   * @param {string} options.postsType - Type of posts to return [image, video, all]
   */
  getPosts(options) {
    return new Promise((resolve, reject) => {
      if (!this.headers || !this.headers.cookie || !this.headers['user-agent'] || !this.headers['x-ig-app-id'])
        return reject('Headers are required!');
      if (!options.profile || options.profile === '') return reject('Profile is required!');
      if (!options.getBase64) options.getBase64 = false;
      if (!options.maxPosts) options.maxPosts = 50;
      if (!options.postsType) postsType.postsType === 'all';
      if (['image', 'video', 'all'].indexOf(options.postsType.toLocaleLowerCase()) === -1) 
        return reject('Invalid post type!');
      options.postsType = options.postsType.toLocaleLowerCase();

      this.getProfile(options.profile)
      .then(profile => {
        const opt = {
          url: `https://i.instagram.com/api/v1/feed/user/${profile.id}/?count=${options.maxPosts}`,
          headers: this.headers
        };
        request(opt, async (err, res, body) => {
          if (err || res.statusCode !== 200) return reject(err);
          const data = JSON.parse(body);
          const itemsFiltered = options.postsType === 'all'
            ? data.items
            : data.items.filter(item =>
                (
                  (options.postsType === 'video' && item.video_versions)
                  || (options.postsType === 'image' && !item.video_versions)
                )
              );
          const items = options.getRandomItem
            ? [itemsFiltered[Math.floor(Math.random()*itemsFiltered.length)]]
            : itemsFiltered;

          const posts = await Promise.all(items.map(async (item) => {
            const post = {
              id: item.pk,
              time: item.device_timestamp,
              type: item.video_versions ? 'video' : 'image',
              likes: item.like_count,
              comments: item.comment_count || 0,
              link: `https://www.instagram.com/p/${item.code}/`,
              caption: item.caption?.text
            }

            if (post.type === 'image') {
              try {
                if (item.image_versions2) {
                  const imageUrl = item.image_versions2.candidates.find(el => el.width === 1080)?.url;
                  post.imageUrl = imageUrl ? imageUrl : item.image_versions2.candidates[0].url;
                  if (options.getBase64) {
                    post.imageBase64 = await imageToBase64(post.imageUrl);
                  }
                } else if (item.carousel_media) {
                  const imagesUrl = item.carousel_media.map(image => {
                    const imageUrl = image.image_versions2.candidates.find(el => el.width === 1080)?.url || image.image_versions2.candidates[0].url;
                    return imageUrl;
                  });
                  post.images = imagesUrl;

                  if (options.getBase64) {
                    post.imagesBase64 = [];
                    for (image in post.images) {
                      post.imagesBase64.push(await imageToBase64(image));
                    }
                  }
                }
                
              } catch (error) {
                console.log('Item error: ', item.id);
              }
            } else {
              post.videoUrl = item.video_versions[0].url;
            }
            return post;
          }));

          resolve(options.getRandomItem ? posts[0] : posts);
        })
      })
      .catch(err => reject(err));
    });
  }
}

module.exports = InstagramGetPosts;