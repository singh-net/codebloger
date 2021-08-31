using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class FollowRepository : IFollowRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public FollowRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<UserFollow> GetUserFollow(int sourceUserId, int followedUserId)
        {
            // var f =  await _context.UserFollows.FindAsync(sourceUserId, followedUserId);
            // await _context.DisposeAsync();
            // return f;
            return await _context.UserFollows.FindAsync(sourceUserId, followedUserId);
        }

        public async Task<AppUser> GetUserWithFollows(int userId)
        {
            return await _context.Users
                      .Include(x => x.FollowedUsers)
                      .FirstOrDefaultAsync(x => x.Id == userId);
        }


        public async Task<List<MemberForListDto>> GetUserFollowersAsync(int id)
        {
            var followers = await _context.UserFollows.Where(u => u.SourceUserId == id).ToListAsync();

            var followingUsers = new List<AppUser>();
            foreach (var user in followers)
            {
                followingUsers.Add(await _context.Users.Include(p => p.UserPhotos).FirstOrDefaultAsync(u => u.Id == user.FollowedUserId));
            }

            return _mapper.Map<List<AppUser>, List<MemberForListDto>>(followingUsers);

        }

        public async Task<List<MemberForListDto>> GetUserFollowingsAsync(int id)
        {
            var followings = await _context.UserFollows.Where(u => u.FollowedUserId == id).ToListAsync();

            var followingUsers = new List<AppUser>();
            foreach (var user in followings)
            {
                followingUsers.Add(await _context.Users.Include(p => p.UserPhotos).FirstOrDefaultAsync(u => u.Id == user.SourceUserId));
            }

            return _mapper.Map<List<AppUser>, List<MemberForListDto>>(followingUsers);

        }

       

    }
}