module.exports = exports = {
  '100': {
    status: 100,
    name: 'Continue',
    message: 'Continue with the request.',
  },
  '101': {
    status: 101,
    name: 'Switching Protocols',
    message: 'Requester has asked the server to switch protocols.',
  },
  '102': {
    status: 102,
    name: 'Processing',
    message: 'The request is still being processed.',
  },
  '200': {
    status: 200,
    name: 'Ok',
    message: 'Request has successfully been completed.',
  },
  '201': {
    status: 201,
    name: 'Created',
    message:
      'The request has been fulfilled and resulted in a new resource being created.',
  },
  '202': {
    status: 202,
    name: 'Accepted',
    message:
      'The request has been accepted for processing, but the processing has not been completed.',
  },
  '203': {
    status: 203,
    name: 'Non-Authoritative Information',
    message:
      'The server successfully processed the request, but is returning information that may be from another source.',
  },
  '204': {
    status: 204,
    name: 'No Content',
    message:
      'The server successfully processed the request, but is not returning any content.',
  },
  '205': {
    status: 205,
    name: 'Reset Content',
    message:
      'The server successfully processed the request, but is not returning any content.',
  },
  '206': {
    status: 206,
    name: 'Partial Content',
    message:
      'The server is delivering only part of the resource (byte serving) due to a range header sent by the client.',
  },
  '207': {
    status: 207,
    name: 'Multi-Status',
    message:
      'The message body that follows is an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.',
  },
  '208': {
    status: 208,
    name: 'Already Reported',
    message:
      'The members of a DAV binding have already been enumerated in a previous reply to this request, and are not being included again.',
  },
  '226': {
    status: 226,
    name: 'IM Used',
    message:
      'The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.',
  },
  '300': {
    status: 300,
    name: 'Multiple Choices',
    message:
      'Indicates multiple options for the resource that the client may follow.',
  },
  '301': {
    status: 301,
    name: 'Moved Permanently',
    message:
      'This and all future requests should be directed to the given URI.',
  },
  '302': {
    status: 302,
    name: 'Found',
    message:
      'The response to the request can be found under another URI using a GET method.',
  },
  '303': {
    status: 303,
    name: 'See Other',
    message:
      'The response to the request can be found under another URI using a GET method.',
  },
  '304': {
    status: 304,
    name: 'Not Modified',
    message:
      'Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match.',
  },
  '305': {
    status: 305,
    name: 'Use Proxy',
    message:
      'The requested resource is only available through a proxy, whose address is provided in the response.',
  },
  '306': {
    status: 306,
    name: 'Switch Proxy',
    message: 'Subsequent requests should use the specified proxy.',
  },
  '307': {
    status: 307,
    name: 'Temporary Redirect',
    message:
      'The request should be repeated with another URI; however, future requests should still use the original URI.',
  },
  '308': {
    status: 308,
    name: 'Permanent Redirect',
    message:
      'he request, and all future requests should be repeated using another URI.',
  },
  '400': {
    status: 400,
    name: 'Bad Request',
    message: 'The server cannot or will not process the request.',
  },
  '401': {
    status: 401,
    name: 'Unauthorized',
    message: 'The request requires user authentication.',
  },
  '402': {
    status: 402,
    name: 'Payment Required',
    message: 'A payment solution is required to fullfil this request.',
  },
  '403': {
    status: 403,
    name: 'Forbidden',
    message:
      'The server understood the request, but is refusing to fulfill it.',
  },
  '404': {
    status: 404,
    name: 'Not Found',
    message: 'The server has not found anything matching the Request-URI.',
  },
  '405': {
    status: 405,
    name: 'Method Not Allowed',
    message:
      'The method specified in the Request-Line is not allowed for the resource.',
  },
  '406': {
    status: 406,
    name: 'Not Acceptable',
    message:
      'The requested resource is only capable of generating content not acceptable according to the Accept headers sent in the request.',
  },
  '407': {
    status: 407,
    name: 'Proxy Authentication Required',
    message: 'The client must first authenticate itself with the proxy.',
  },
  '408': {
    status: 408,
    name: 'Request Timeout',
    message: 'The server timed out waiting for the request.',
  },
  '409': {
    status: 409,
    name: 'Conflict',
    message:
      'The request could not be completed due to a conflict with the current state of the resource.',
  },
  '410': {
    status: 410,
    name: 'Gone',
    message:
      'Indicates that the resource requested is no longer available and will not be available again.',
  },
  '411': {
    status: 411,
    name: 'Length Required',
    message:
      'The request did not specify the length of its content, which is required by the requested resource.',
  },
  '412': {
    status: 412,
    name: 'Precondition Failed',
    message:
      'The server does not meet one of the preconditions that the requester put on the request.',
  },
  '413': {
    status: 413,
    name: 'Request Entity Too Large',
    message:
      'The request is larger than the server is willing or able to process.',
  },
  '414': {
    status: 414,
    name: 'Request-URI Too Long',
    message: 'The URI provided was too long for the server to process.',
  },
  '415': {
    status: 415,
    name: 'Unsupported Media Type',
    message:
      'The request entity has a media type which the server or resource does not support.',
  },
  '416': {
    status: 416,
    name: 'Requested Range Not Satisfiable',
    message:
      'The client has asked for a portion of the file (byte serving), but the server cannot supply that portion.',
  },
  '417': {
    status: 417,
    name: 'Expectation Failed',
    message:
      'The server cannot meet the requirements of the Expect request-header field.',
  },
  '418': {
    status: 418,
    name: "I'm a teapot",
    message:
      'Tea loves oxygen – it helps the flavour develop, so always use freshly drawn cold water in the kettle.',
  },
  '419': {
    status: 419,
    name: 'Authentication Timeout ',
    message:
      'Not a part of the HTTP standard, 419 Authentication Timeout denotes that previously valid authentication has expired.',
  },
  '420': {
    status: 420,
    name: 'Method Failure',
    message: 'A method within the server application has failed.',
  },
  '422': {
    status: 422,
    name: 'Unprocessable Entity',
    message:
      'The request was well-formed but was unable to be followed due to semantic errors.',
  },
  '423': {
    status: 423,
    name: 'Locked',
    message: 'The resource that is being accessed is locked.',
  },
  '424': {
    status: 424,
    name: 'Failed Dependency',
    message: 'The request failed due to failure of a previous request.',
  },
  '426': {
    status: 426,
    name: 'Upgrade Required',
    message:
      'The client should switch to a different protocol such as TLS/1.0.',
  },
  '428': {
    status: 428,
    name: 'Precondition Required',
    message: 'The origin server requires the request to be conditional.',
  },
  '429': {
    status: 429,
    name: 'Too Many Requests',
    message: 'The user has sent too many requests in a given amount of time.',
  },
  '431': {
    status: 431,
    name: 'Request Header Fields Too Large',
    message:
      'The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.',
  },
  '440': {
    status: 440,
    name: 'Login Timeout',
    message: 'A Microsoft extension. Indicates that your session has expired.',
  },
  '444': {
    status: 444,
    name: 'No Response',
    message:
      'Used in Nginx logs to indicate that the server has returned no information to the client and closed the connection.',
  },
  '449': {
    status: 449,
    name: 'Retry With',
    message:
      'The request should be retried after performing the appropriate action.',
  },
  '450': {
    status: 450,
    name: 'Blocked by Windows Parental Controls',
    message:
      'This error is given when Windows Parental Controls are turned on and are blocking access to the given webpage.',
  },
  '451': {
    status: 451,
    name: 'Unavailable For Legal Reasons',
    message: 'Nginx internal code similar to 431.',
  },
  '494': {
    status: 494,
    name: 'Request Header Too Large',
    message:
      'Nginx internal code used when SSL client certificate error occurred to distinguish it from 4XX in a log and an error page redirection.',
  },
  '495': {
    status: 495,
    name: 'Cert Error',
    message:
      "Nginx internal code used when client didn't provide certificate to distinguish it from 4XX in a log and an error page redirection.",
  },
  '496': {
    status: 496,
    name: 'No Cert',
    message:
      "Nginx internal code used when client didn't provide certificate to distinguish it from 4XX in a log and an error page redirection.",
  },
  '497': {
    status: 497,
    name: 'HTTP to HTTPS',
    message:
      'Nginx internal code used for the plain HTTP requests that are sent to HTTPS port to distinguish it from 4XX in a log and an error page redirection.',
  },
  '498': {
    status: 498,
    name: 'Token expired/invalid',
    message:
      'Returned by ArcGIS for Server. A code of 498 indicates an expired or otherwise invalid token.',
  },
  '499': {
    status: 499,
    name: 'Client Closed Request',
    message:
      'Used in Nginx logs to indicate when the connection has been closed by client while the server is still processing its request, making server unable to send a status code back.',
  },
  '500': {
    status: 500,
    name: 'Internal Server Error',
    message:
      'The server encountered an unexpected condition which prevented it from fulfilling the request.',
  },
  '501': {
    status: 501,
    name: 'Not Implemented',
    message:
      'The server either does not recognize the request method, or it lacks the ability to fulfil the request.',
  },
  '502': {
    status: 502,
    name: 'Bad Gateway',
    message:
      'The server was acting as a gateway or proxy and received an invalid response from the upstream server.',
  },
  '503': {
    status: 503,
    name: 'Service Unavailable',
    message: 'The server is currently unavailable.',
  },
  '504': {
    status: 504,
    name: 'Gateway Timeout',
    message:
      'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.',
  },
  '505': {
    status: 505,
    name: 'HTTP Version Not Supported',
    message:
      'The server does not support the HTTP protocol version used in the request.',
  },
  '506': {
    status: 506,
    name: 'Variant Also Negotiates',
    message:
      'Transparent content negotiation for the request results in a circular reference.',
  },
  '507': {
    status: 507,
    name: 'Insufficient Storage',
    message:
      'The server is unable to store the representation needed to complete the request.',
  },
  '508': {
    status: 508,
    name: 'Loop Detected',
    message:
      'The server detected an infinite loop while processing the request.',
  },
  '509': {
    status: 509,
    name: 'Bandwidth Limit Exceeded',
    message: 'The bandwidth used by request has exceeded limit.',
  },
  '510': {
    status: 510,
    name: 'Not Extended',
    message:
      'Further extensions to the request are required for the server to fulfil it.',
  },
  '511': {
    status: 511,
    name: 'Network Authentication Required',
    message: 'The client needs to authenticate to gain network access.',
  },
  '598': {
    status: 598,
    name: 'Network read timeout error',
    message:
      'The request timed out behind the proxy to a client in front of the proxy.',
  },
  '599': {
    status: 599,
    name: 'Network connect timeout error',
    message:
      'The network connect request has timed out behind the proxy to a client in front of the proxy.',
  },
  get: function(code) {
    return module.exports[code || 400];
  },
};

Object.keys(module.exports).forEach(function(key) {
  var obj = module.exports[key];
  if (obj instanceof Object) {
    var name = obj.name.replace(/\s/gi, '_').toUpperCase();
    module.exports[name] = obj;
  }
});
