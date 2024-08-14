namespace WebEditor2.Services
{
    public class Session<T>(IHttpContextAccessor httpContextAccessor)
    {
        private readonly Dictionary<string, T> _sessionObjects = [];

        private string GetCurrentSessionKey()
        {
            var key = httpContextAccessor.HttpContext.Session.GetString("session");
            if (key != null)
            {
                return key;
            }

            key = Guid.NewGuid().ToString();
            httpContextAccessor.HttpContext.Session.SetString("session", key);
            return key;
        }

        public void Set(T value)
        {
            _sessionObjects[GetCurrentSessionKey()] = value;
        }

        public T Get()
        {
            return _sessionObjects[GetCurrentSessionKey()];
        }
    }
}
