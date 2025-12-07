# 🚀 Deployment Checklist for FrameKart

Use this checklist before deploying to production.

## Pre-Deployment

### Code Quality
- [ ] Remove all console.log statements
- [ ] Remove dummy/test data
- [ ] Update all placeholder text
- [ ] Test all pages and features
- [ ] Check responsive design on mobile/tablet
- [ ] Test all forms and validations
- [ ] Verify all images load correctly

### Security
- [ ] All API keys are in environment variables
- [ ] No sensitive data in code
- [ ] `.env.local` is in `.gitignore`
- [ ] CORS is properly configured
- [ ] Rate limiting is set up (if needed)
- [ ] SQL/NoSQL injection protection is in place

### Environment Variables
- [ ] MongoDB URI (production database)
- [ ] Clerk keys (production)
- [ ] Razorpay keys (live mode)
- [ ] Cloudinary credentials
- [ ] App URL (production domain)
- [ ] Webhook secrets

## Database Setup

### MongoDB Atlas
- [ ] Production cluster created
- [ ] Database user created with strong password
- [ ] IP whitelist configured (allow all for Vercel: 0.0.0.0/0)
- [ ] Indexes created for performance
- [ ] Backup enabled
- [ ] Connection string updated in env vars

### Initial Data
- [ ] Admin user created
- [ ] Sample products added
- [ ] Categories configured
- [ ] Test orders removed

## Third-Party Services

### Clerk Authentication
- [ ] Production instance created
- [ ] API keys updated
- [ ] Redirect URLs configured
- [ ] Webhook endpoint set up
- [ ] Webhook signing secret updated
- [ ] Email templates customized
- [ ] Social login configured (optional)

### Razorpay
- [ ] Live mode enabled
- [ ] KYC completed
- [ ] API keys updated (live)
- [ ] Webhook configured
- [ ] Payment methods enabled
- [ ] Test payments completed

### Cloudinary
- [ ] Production settings configured
- [ ] Upload presets created
- [ ] Auto-moderation enabled (optional)
- [ ] CDN configured
- [ ] Storage quota checked

## Vercel Deployment

### Project Setup
- [ ] Code pushed to GitHub
- [ ] Repository connected to Vercel
- [ ] Project name configured
- [ ] Framework preset: Next.js
- [ ] Build command: `next build`
- [ ] Output directory: `.next`

### Environment Variables
- [ ] All production env vars added
- [ ] No test/development keys
- [ ] Secrets are encrypted
- [ ] Webhook URLs updated

### Domain Configuration
- [ ] Custom domain added
- [ ] SSL certificate configured
- [ ] DNS records updated
- [ ] Redirects configured (www → non-www)

### Performance
- [ ] Image optimization enabled
- [ ] Caching configured
- [ ] ISR (Incremental Static Regeneration) set up
- [ ] Edge functions optimized

## Post-Deployment

### Testing
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Payment flow works end-to-end
- [ ] Admin panel accessible
- [ ] Image uploads work
- [ ] Email notifications work (if implemented)
- [ ] Mobile experience tested
- [ ] Cross-browser testing done

### Monitoring
- [ ] Vercel Analytics enabled
- [ ] Error tracking set up (Sentry optional)
- [ ] Uptime monitoring configured
- [ ] Performance metrics reviewed

### SEO & Marketing
- [ ] Meta tags updated
- [ ] Open Graph images set
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Google Analytics added (optional)
- [ ] Social media links updated

### Legal & Compliance
- [ ] Privacy Policy added
- [ ] Terms of Service added
- [ ] Return/Refund Policy added
- [ ] Shipping Policy added
- [ ] Cookie consent (if using cookies)
- [ ] GDPR compliance (if applicable)

### Documentation
- [ ] README.md updated
- [ ] API documentation created
- [ ] Admin guide written
- [ ] User guide created (optional)

## Launch Day

### Final Checks
- [ ] All features tested in production
- [ ] Payment gateway tested with real card
- [ ] Customer support email set up
- [ ] Backup plan ready
- [ ] Rollback plan documented
- [ ] Team notified

### Monitoring (First 24 Hours)
- [ ] Monitor error logs
- [ ] Check payment transactions
- [ ] Monitor server resources
- [ ] Review user signups
- [ ] Check email deliverability
- [ ] Monitor website speed

## Ongoing Maintenance

### Weekly
- [ ] Review error logs
- [ ] Check payment status
- [ ] Monitor database size
- [ ] Review user feedback

### Monthly
- [ ] Update dependencies
- [ ] Review security patches
- [ ] Backup verification
- [ ] Performance optimization
- [ ] Cost analysis

### Quarterly
- [ ] Full security audit
- [ ] User experience review
- [ ] Feature planning
- [ ] Competitor analysis

## Emergency Contacts

- **Vercel Support**: support@vercel.com
- **MongoDB Support**: Via Atlas dashboard
- **Clerk Support**: support@clerk.com
- **Razorpay Support**: support@razorpay.com
- **Cloudinary Support**: support@cloudinary.com

## Rollback Plan

If something goes wrong:

1. **Immediate**: Use Vercel's instant rollback feature
2. **Database**: Restore from MongoDB Atlas backup
3. **Code**: Revert to previous Git commit
4. **Communication**: Notify users via email/social media

## Success Metrics

Track these metrics post-launch:

- [ ] Daily active users
- [ ] Conversion rate
- [ ] Average order value
- [ ] Cart abandonment rate
- [ ] Page load time
- [ ] Error rate
- [ ] Customer satisfaction

---

**Remember**: Always test in staging before deploying to production!

**Good luck with your launch! 🎉**
