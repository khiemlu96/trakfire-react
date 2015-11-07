# clock program day:hour:min:sec

d = 0 
h = 0
m = 0
s = 0
m_d = 1
m_h = 24
m_m = 60
m_s = 60
stop = false
while !stop do
	s=s+1 
	if s >= m_s 
		m=m+1
		s=0
	end
	if m >= m_m 
		h=h+1
		m=0
		s=0
	end
	if h >= m_h 
		d=d+1
		h=0
		m=0 
		s=0 
	end
	if d > m_d 
		d=0
		h=0
		m=0 
		s=0 
		stop = true	
	end
	clock = "%d:%d:%d:%d" % [d, h, m, s]
	puts clock
end