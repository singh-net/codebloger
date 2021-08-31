using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            return await _context.Users

                 .Include(p => p.UserPhotos.Where(c => !c.isProfileImage))
                 .Where(x => x.UserName == username)
                 .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                 .SingleOrDefaultAsync();
        }

        public async Task<List<MemberDto>> GetMembersAsync()
        {
            var users = await _context.Users.ToListAsync();
            return _mapper.Map<List<AppUser>, List<MemberDto>>(users);
        }

        public async Task<List<MemberForListDto>> GetTopBloggersAsync()
        {
            var members = await _context.Users.Include(u => u.FollowedByUsers).Include(p => p.UserPhotos).Take(20).OrderByDescending(f => f.FollowedByUsers.Count()).ToListAsync();
            return _mapper.Map<List<AppUser>, List<MemberForListDto>>(members);
        }



        public async Task<List<MemberDto>> GetUserAsync() //method need fix
        {
            var users = await _context.Users.ToListAsync();
            return _mapper.Map<List<AppUser>, List<MemberDto>>(users);

        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.Include(l => l.LikedArticles).FirstOrDefaultAsync(a => a.Id == id);

        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users

                //.Where(x => x.UserName == username)
                .Include(p => p.UserPhotos)
                .SingleOrDefaultAsync(x => x.UserName == username);
        }

        public Task<string> GetUserGender(string username)
        {
            throw new System.NotImplementedException();
        }

        public Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            throw new System.NotImplementedException();
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}