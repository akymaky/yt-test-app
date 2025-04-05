const settings = {
  compact: false
}

exports.httpHandler = {
  endpoints: [
    {
      method: 'GET',
      path: 'preferences',
      handle: function handle(ctx) {
        ctx.response.json(settings);
      }
    },
    {
      method: 'POST',
      path: 'preferences',
      handle: function handle(ctx) {
        const body = JSON.parse(ctx.request.body);
        settings.compact = body.compact;
        ctx.response.json(settings);
      }
    }
  ]
};
