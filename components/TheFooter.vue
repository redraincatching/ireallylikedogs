<template>
  
  <div>
  <footer id="footer" class="footer">
    <div class="footer-content position-relative">
      <div class="container">
        <div class="row">
          

            <div class="footer-info">
                <h3>Crate Digger</h3>
                <p>Abbey Road <br>London NW8 9AY, England<br><br>
                <strong>Phone:</strong> 089 4532 501<br>
                <strong>Email:</strong> cratedigger@gmail.com<br></p>
                <div class="social-links d-flex mt-3">
                <a  href="https://twitter.com/radiohead" class="d-flex align-items-center justify-content-center"><i class="bi bi-twitter"></i></a>
                <a href="https://www.instagram.com/weezer/" class="d-flex align-items-center justify-content-center"><i class="bi bi-instagram"></i></a>
                </div>
            </div>
          </div><!-- End footer info column-->
            
          <div class="footer-legal text-center position-relative">
     
          &copy; Copyright <strong><span>Crate Digger</span></strong>. All Rights Reserved <br>
        </div>
      </div>
    </div>
  </footer>
</div>
  
</template>


<style scoped>
.footer {
  text-align: center;
  
  color: white;
  background-color: #828282;
  background-size: cover;
  font-size: 14px;
  padding: 80px 0 60px 0;
  position: relative;
}

.footer:before {
  content: "";
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  inset: 0;
}

.footer .footer-content .footer-info {
  margin-bottom: 30px;
}

.footer .footer-content .footer-info h3 {
  
  font-size: 28px;
  margin: 0 0 20px 0;
  padding: 2px 0 2px 0;
  line-height: 1;
  font-weight: 700;
  text-transform: uppercase;
}

.footer .footer-content .footer-info h3 span {
  color: var(--color-primary);
}

.footer .footer-content .footer-info p {
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 0;
  font-family: var(--font-primary);
  color: #fff;
}

.footer .footer-content .social-links a {
  position: relative;
  left: 47%;
  font-size: 18px;
  display: inline-block;
  background:#262626;
  color: #fff;
  line-height: 1;
  margin-right: 8px;
  border-radius: 4px;
  width: 36px;
  height: 36px;
  transition: 0.3s;
}

.footer .footer-content .social-links a:hover {
  background: #1DB954;
  text-decoration: none;
}

.footer .footer-legal .copyright {
  text-align: left;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}


</style>