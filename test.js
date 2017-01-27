'use strict';

describe('User Interface', function() {
  var injector, scope, element, httpBackend;

  beforeEach(function() {
    injector = angular.injector(['urlShortener', 'ngMockE2E']);
    injector.invoke(function($rootScope, $compile, $httpBackend) {
      scope = $rootScope.$new();

      $httpBackend.whenGET(/.*\/templates\/.*/i).passThrough();
      httpBackend = $httpBackend;
      element = $compile('<url-shortener></url-shortener>')(scope);
      scope.$apply();
    });
  });

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('initialize UI correctly', function(done) {
    scope.$on('urlShortenerController', function() {
      assert.lengthOf( element.find('input[type="text"]').toArray(), 1 );
      assert.lengthOf( element.find('button:disabled').toArray(), 1 );
      done();
    });
  });

  it('disables the button when input is invalid', function(done) {
    scope.$on('urlShortenerController', function() {
      var invalidUrls = [
        'rwevervewvwv',
        'http://google.,<>/{}[]\\```',
      ];
      var $input = element.find('input').eq(0);
      var $button = element.find('button').eq(0);
      for(let url of invalidUrls) {
        $input.val(url).trigger('input');
        assert.isOk( $button.prop('disabled') );
      }
      done();
    });
  });

  it('responds with a shortened URL when button is clicked', function(done)
    {
      const resUrl = 'somerandom.com/url/';
      httpBackend.expectGET(/\/api\/new.*/).respond({
        url: resUrl
      });
      scope.$on('urlShortenerController', function() {
        var $button = element.find('button').eq(0);
        var $input = element.find('input').eq(0);
        assert.isOk( $button.prop('disabled') );
        $input.val('google.com').trigger('input');
        assert.notOk( $button.prop('disabled') );
        $button.trigger('click');
        assert.isOk( $button.prop('disabled') );
        httpBackend.flush();
        assert.notOk( $button.prop('disabled') );
        assert.include( element.text(), resUrl );
        done();
      });
    }
  );

  it('displays error message from server when necessary', function(done) {
    const errMsg = 'Some error messages hello World!';
    httpBackend.expectGET(/\/api\/new.*/).respond(400, {
      error: errMsg
    });
    scope.$on('urlShortenerController', function() {
      var $input = element.find('input').eq(0);
      var $button = element.find('button').eq(0);
      assert.isOk( $button.prop('disabled') );
      $input.val('google.com').trigger('input');
      assert.isNotOk( $button.prop('disabled') );
      $button.trigger('click');
      assert.isOk( $button.prop('disabled') );
      httpBackend.flush();
      assert.isNotOk( $button.prop('disabled') );
      assert.include( element.text(), errMsg );
      done();
    });
  });
});
