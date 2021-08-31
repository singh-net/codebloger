using System.Threading.Tasks;
using API.Entities;

namespace API.Interfaces
{
    public interface IArticleLikeRepository
    {
        Task<ArticleLike> GetArticleLike(int userId, int articleId);
        Task<AppUser> GetUserArticleLikes(int userId);

        //Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams);
        //Task<> Get
         
    }
}