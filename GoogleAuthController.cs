using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IConfiguration configuration, ILogger<AuthController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleAuth([FromBody] GoogleAuthRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Code))
            {
                return BadRequest(new { error = "Authorization code is required" });
            }

            // Exchange code for tokens
            var tokenResponse = await ExchangeCodeForTokens(request.Code, request.RedirectUri);
            
            if (!tokenResponse.IsSuccessStatusCode)
            {
                var errorContent = await tokenResponse.Content.ReadAsStringAsync();
                _logger.LogError("Google token exchange failed: {Error}", errorContent);
                return BadRequest(new { error = "Failed to exchange authorization code" });
            }

            var tokenData = await tokenResponse.Content.ReadFromJsonAsync<GoogleTokenResponse>();

            // Get user info from Google
            var userInfo = await GetUserInfo(tokenData.AccessToken);

            // Return user data and tokens
            return Ok(new
            {
                user = new
                {
                    id = userInfo.Id,
                    email = userInfo.Email,
                    name = userInfo.Name,
                    picture = userInfo.Picture
                },
                accessToken = tokenData.AccessToken,
                refreshToken = tokenData.RefreshToken
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Google auth error");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    private async Task<HttpResponseMessage> ExchangeCodeForTokens(string code, string redirectUri)
    {
        using var httpClient = new HttpClient();
        
        var tokenRequest = new Dictionary<string, string>
        {
            ["code"] = code,
            ["client_id"] = _configuration["Google:ClientId"],
            ["client_secret"] = _configuration["Google:ClientSecret"],
            ["redirect_uri"] = redirectUri,
            ["grant_type"] = "authorization_code"
        };

        var content = new FormUrlEncodedContent(tokenRequest);
        
        return await httpClient.PostAsync("https://oauth2.googleapis.com/token", content);
    }

    private async Task<GoogleUserInfo> GetUserInfo(string accessToken)
    {
        using var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
        
        var response = await httpClient.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<GoogleUserInfo>();
    }
}

// Request/Response Models
public class GoogleAuthRequest
{
    public string Code { get; set; }
    public string RedirectUri { get; set; }
}

public class GoogleTokenResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }
    
    [JsonPropertyName("refresh_token")]
    public string RefreshToken { get; set; }
    
    [JsonPropertyName("token_type")]
    public string TokenType { get; set; }
    
    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
}

public class GoogleUserInfo
{
    [JsonPropertyName("id")]
    public string Id { get; set; }
    
    [JsonPropertyName("email")]
    public string Email { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; }
    
    [JsonPropertyName("picture")]
    public string Picture { get; set; }
}
