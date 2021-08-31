using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;

namespace API.Interfaces
{
    public interface IFollowRepository
    {
        Task<UserFollow> GetUserFollow(int sourceUserId, int followedUserId);
        Task<AppUser> GetUserWithFollows(int userId);
        //Task<PagedList<LikeDto>> GetUserFollows(LikesParams likesParams);

        Task<List<MemberForListDto>> GetUserFollowersAsync(int id);
        Task<List<MemberForListDto>> GetUserFollowingsAsync(int id);

    }
}