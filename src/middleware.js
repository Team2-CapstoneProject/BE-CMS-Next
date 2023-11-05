import { NextResponse } from 'next/server';
import cors from './lib/cors';
 
// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: ['/api/auth/registeruserprof/:function*', '/api/mobile/:function*', '/api/dashboard/:function*'],
}
 
export function middleware(request) {
  const requestHeaders = new Headers(request.headers);

  if (requestHeaders.get('authorization') !== null) {
    const res = NextResponse.next();
    return cors(request, res);
  } else {
    return NextResponse.json(
      { success: false, message: 'Authentication failed. You must login first.' },
      { status: 401 }
    )
  }
}


// import { NextResponse } from 'next/server';

// export const config = {
//   matcher: ['/api/auth/registeruserprof/:function*', '/api/mobile/:path*', '/api/dashboard/:path*']
// }

// export function middleware(request) {
//   const requestHeaders = new Headers(request.headers);
//   return NextResponse.json(
//     {
//       message: "Required fields must be filled in.",
//     },
//     { status: 400 }
//   );

//   if (request.nextUrl.pathname.startsWith('/api/auth') || request.nextUrl.pathname.startsWith('/api/mobile')) {
//     console.log('user: ', requestHeaders);
    
//   }

//   if (request.nextUrl.pathname.startsWith('/api/dashboard') ) {
//     console.log('admin: ', requestHeaders);
//   }
// }



// const isLoggedIn = (req, res, next) => {
//   const bearerHeader = req.headers['authorization'];

//   if (typeof bearerHeader !== 'undefined') {
//     console.log('--- User Bearer Header:', bearerHeader);
//     req.userdata = verifyToken(bearerHeader.split(' ')[1]);
//     next();
//   } else {
//     return res.status(401).json({ message: "You must login first." });
//   }
// };

// const isLoggedInAdmin = (req, res, next) => {
//   const bearerHeader = req.headers['authorization'];

//   if (typeof bearerHeader !== 'undefined') {
//     console.log('--- Admin Bearer Header:', bearerHeader);
//     const user = verifyToken(bearerHeader.split(' ')[1]);

//     if (user.email === 'admin') {
//       console.log('Welcome admin.');
//       next();
//     } else {
//       return res.status(401).json({ message: "You must login as admin." });
//     }
//   } else {
//     return res.status(401).json({ message: "You must login as admin." });
//   }
// };

// export { isLoggedIn, isLoggedInAdmin };
