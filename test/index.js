import { expect } from 'chai';
import cssToJss from '../src/cssToJss';

describe('JSS-CSS', function() {
  it('should support classes', function() {
    expect(cssToJss('.link { border: 0; }')).to.eql({
      link: {
        border: '0'
      }
    });
  });

  it('should support tags', function() {
    expect(cssToJss('a { border: 0; }')).to.eql({
      a: {
        border: '0'
      }
    });
  });

  it('should support @media', function() {
    expect(cssToJss('@media (min-width: 100px) { a { border: 0; } }')).to.eql({
      '@media (min-width: 100px)': {
        a: {
          border: '0'
        }
      }
    });
  });

  it('should support @keyframes', function() {
    expect(cssToJss('@keyframes anim { from { opacity: 0; } to { opacity: 1; } }')).to.eql({
      '@keyframes anim': {
        from: {
          opacity: '0'
        },
        to: {
          opacity: '1'
        }
      }
    });
  });

  it('should support nested', function() {
    expect(cssToJss('.link ~ .link { border: 0; }')).to.eql({
      link: {
        '& ~ &': {
          border: '0'
        }
      }
    });
  });
});
