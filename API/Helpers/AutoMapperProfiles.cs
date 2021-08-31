using System.Linq;
using API.Dtos;
using API.Entities;
using AutoMapper;
using API.Extensions;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
             .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhotos.FirstOrDefault(x => x.IsMain).Url))
             .ForMember(dest => dest.totalFollowers, opt => opt.MapFrom(src => src.FollowedByUsers.Count()));

            CreateMap<MemberDto, AppUser>();
            CreateMap<UserPhotoDto, UserPhoto>();

            CreateMap<AppUser, FollowDto>()
                             .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhotos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<AppUser, MemberForListDto>()
                         .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.UserPhotos.FirstOrDefault(x => x.IsMain).Url))
                         .ForMember(dest => dest.TotalFollowers, opt => opt.MapFrom(src => src.FollowedByUsers.Count()));


            CreateMap<Comment, CommentDto>()
                       .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.AppUser.UserName))
                       .ForMember(dest => dest.UserFullName, opt => opt.MapFrom(src => src.AppUser.Name))
                       .ForMember(dest => dest.UserPhotoUrl, opt => opt.MapFrom(src => src.AppUser.UserPhotos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<CommentDto, Comment>();



            CreateMap<RegisterDto, AppUser>();

            CreateMap<Category, CategoryDto>()
              .ForMember(dest => dest.PostCount, opt => opt.MapFrom(src => src.ArticleCategories.Count()));


            CreateMap<CategoryDto, Category>(); //

            CreateMap<UserPhoto, UserPhotoDto>();

            CreateMap<MemberUpdateDto, AppUser>();

            CreateMap<Article, ArticleForListsDto>()
            .ForMember(dest => dest.Username, opt => opt
                   .MapFrom(src => src.AppUser.UserName));

            CreateMap<Article, ArticleToReturnDto>()
                   .ForMember(dest => dest.Categories, opt => opt
                   .MapFrom(src => src.ArticleCategories
                   .Select(ac => ac.Category)
                   .ToList().AsQueryable()))

                   .ForMember(dest => dest.AppUserFullName, opt => opt
                   .MapFrom(src => src.AppUser.Name))

                   .ForMember(dest => dest.Username, opt => opt
                   .MapFrom(src => src.AppUser.UserName))

                   .ForMember(dest => dest.LikeCount, opt => opt
                   .MapFrom(src => src.LikedArticles.Count()))

                     .ForMember(dest => dest.CommentCount, opt => opt
                   .MapFrom(src => src.Comments.Count()))

                   .ForMember(dest => dest.ReadTime, opt => opt
                   .MapFrom(src => src.Content.ReadTime()))

                    .ForMember(dest => dest.AppUserPhotoUrl, opt =>
                     opt.MapFrom(src => src.AppUser.UserPhotos.FirstOrDefault(x => x.IsMain).Url));


            //CreateMap<CategoryDto, Category>();
            CreateMap<ArticleToReturnDto, Article>();

        }
    }
}