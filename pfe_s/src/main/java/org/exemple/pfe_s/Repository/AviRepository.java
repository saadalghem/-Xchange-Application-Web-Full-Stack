package org.exemple.pfe_s.Repository;

import org.exemple.pfe_s.Entity.Avis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AviRepository extends JpaRepository<Avis, Long> {

    List<Avis> findAllByOrderByIdDesc();
}
