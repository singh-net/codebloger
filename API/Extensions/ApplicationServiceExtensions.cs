using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {


            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            } );
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));

            services.AddScoped<ITokenService, TokenService>();
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<IArticleLikeRepository, ArticleLikeRepository>();
            services.AddScoped<ICommentRepository, CommentRepository>();

            return services;

        }

    }
}